import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import { MemberParam, GenderParam } from "../../models/member"
import { OrderParam } from "../../models/table"
import { getComparator, stableSort } from "../../utils/table"
import EnhancedTableHead from "./EnhancedTableHead"
import EnhancedTableToolbar from "./EnhancedTableToolbar"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import _ from "lodash"
import { observer } from "mobx-react"
import { otherStore } from "../../store"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import PopupMemberCreate from "./PopupMemberCreate"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import moment from "moment"

const apiClient = ApiClient.getInstance()

interface EnhancedTableProps {
  member_rows: MemberParam[]
}

const EnhancedTable = ({ member_rows }: EnhancedTableProps) => {
  const { setLoading, setToastParams } = otherStore

  const [order, setOrder] = useState<OrderParam>("asc")
  const [orderBy, setOrderBy] = useState<keyof MemberParam>("fullname")
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [edit_id, setEditId] = useState("-1")
  const [rows, setRows] = useState<MemberParam[]>(_.cloneDeep(member_rows))
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    setRows(_.cloneDeep(member_rows))
  }, [member_rows])

  const handleRequestSort = (e: React.MouseEvent<unknown>, property: keyof MemberParam) => {
    e.preventDefault()
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (_id: string) => {
    const selectedIndex = selected.indexOf(_id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (e: any, newPage: number) => {
    e.preventDefault()
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const handleRowAction = (_id: string) => {
    if (edit_id === _id) {
      const updatedIndex = _.findIndex(rows, (o) => o._id === _id)
      if (updatedIndex > -1) {
        handleUpdateRow(rows[updatedIndex], updatedIndex)
      }
    } else {
      setEditId(_id)
    }
  }

  const handleUpdateRow = async (row: MemberParam, index: number) => {
    setLoading(true)
    let msg = "One row has been updated successfully.",
      isFailed = false

    try {
      const results = await apiClient.put<{ updated: number }>(
        `${Config.BASE_URL}/members/update/${row._id}`,
        row
      )
      if (results.updated) {
        rows[index] = _.cloneDeep(row)
        setRows([...rows])
      } else {
        msg = "Nothing has been updated."
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Something went wrong to update row data."
      isFailed = true
    } finally {
      setLoading(false)
      setEditId("-1")
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
    }
  }

  const handleRowItemChange = (e: any, keyname: keyof MemberParam) => {
    const newValue = e.target.value
    const editIndex = _.findIndex(rows, (o) => o._id === edit_id)
    if (editIndex > -1) {
      switch (keyname) {
        case "fullname":
          rows[editIndex]["fullname"] = newValue
          break
        case "email":
          rows[editIndex]["email"] = newValue
          break
        case "gender":
          rows[editIndex]["gender"] = newValue as GenderParam
          break
        // case "birthday":
        //   rows[editIndex]["birthday"] = newValue
        //   break
        case "job":
          rows[editIndex]["job"] = newValue
          break
        case "address":
          rows[editIndex]["address"] = newValue
          break
        default:
          break
      }
      setRows([...rows])
    }
  }

  const isSelected = (_id: string) => selected.indexOf(_id) !== -1
  const isEditable = (_id: string) => edit_id === _id

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          rows={rows}
          setRows={setRows}
          setSelected={setSelected}
          setShowCreateDialog={setShowCreateDialog}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const isItemEditable = isEditable(row._id)

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" onClick={() => handleClick(row._id)}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="left"
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.fullname}</p>
                          ) : (
                            <TextField
                              autoFocus
                              margin="dense"
                              id="fullname"
                              // label="Full Name"
                              placeholder="Full Name"
                              type="text"
                              fullWidth
                              variant="outlined"
                              value={row.fullname}
                              onChange={(e) => {
                                handleRowItemChange(e, "fullname")
                              }}
                            />
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.email}</p>
                          ) : (
                            <TextField
                              autoFocus
                              margin="dense"
                              id="email"
                              // label="Email"
                              placeholder="Email"
                              type="text"
                              fullWidth
                              variant="outlined"
                              value={row.email}
                              onChange={(e) => {
                                handleRowItemChange(e, "email")
                              }}
                            />
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.gender}</p>
                          ) : (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={row.gender}
                              // label="Gender"
                              placeholder="Gender"
                              onChange={(e) => {
                                handleRowItemChange(e, "gender")
                              }}
                            >
                              <MenuItem value={"M"}>M</MenuItem>
                              <MenuItem value={"F"}>F</MenuItem>
                            </Select>
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.birthday}</p>
                          ) : (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Birthday"
                                value={row.birthday}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    const editIndex = _.findIndex(rows, (o) => o._id === edit_id)
                                    if (editIndex > -1) {
                                      rows[editIndex]["birthday"] =
                                        moment(newValue).format("YYYY-MM-DD")
                                      setRows([...rows])
                                    }
                                  }
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.job}</p>
                          ) : (
                            <TextField
                              autoFocus
                              margin="dense"
                              id="job"
                              // label="Job"
                              placeholder="Job"
                              type="text"
                              fullWidth
                              variant="outlined"
                              value={row.job}
                              onChange={(e) => {
                                handleRowItemChange(e, "job")
                              }}
                            />
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        <div className="table-row-col">
                          {!isItemEditable ? (
                            <p>{row.address}</p>
                          ) : (
                            <TextField
                              autoFocus
                              margin="dense"
                              id="address"
                              // label="Address"
                              placeholder="Address"
                              type="text"
                              fullWidth
                              variant="outlined"
                              value={row.address}
                              onChange={(e) => {
                                handleRowItemChange(e, "address")
                              }}
                            />
                          )}
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        <div className="table-row-action">
                          <div onClick={() => handleRowAction(row._id)}>
                            {isItemEditable ? <SaveIcon /> : <EditIcon />}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <PopupMemberCreate
        open={showCreateDialog}
        setOpen={setShowCreateDialog}
        rows={rows}
        setRows={setRows}
      />
    </Box>
  )
}

export default observer(EnhancedTable)
