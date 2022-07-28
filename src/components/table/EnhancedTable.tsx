import React, { useState } from "react"
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
import { MemberParam } from "../../models/member"
import { OrderParam } from "../../models/table"
import { getComparator, stableSort } from "../../utils/table"
import EnhancedTableHead from "./EnhancedTableHead"
import EnhancedTableToolbar from "./EnhancedTableToolbar"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import _ from "lodash"

const createMember = (fullname: string, email: string, id: number) => {
  return { id, fullname, email } as MemberParam
}

const member_rows = [
  createMember("Jin Zheng", "jinzh718@gmail.com", 1),
  createMember("Shixiong Han", "shixiong@thetrackapp.com", 2),
]

const EnhancedTable = () => {
  const [order, setOrder] = useState<OrderParam>("asc")
  const [orderBy, setOrderBy] = useState<keyof MemberParam>("fullname")
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [edit_id, setEditId] = useState(-1)
  const [rows, setRows] = useState<MemberParam[]>(_.cloneDeep(member_rows))

  const handleRequestSort = (e: React.MouseEvent<unknown>, property: keyof MemberParam) => {
    e.preventDefault()
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
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

  const handleRowAction = (id: number) => {
    if (edit_id === id) {
      setEditId(-1)
    } else {
      setEditId(id)
    }
  }

  const handleRowItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyname: keyof MemberParam
  ) => {
    const newValue = e.target.value
    const editIndex = _.findIndex(rows, (o) => o.id === edit_id)
    if (editIndex > -1) {
      switch (keyname) {
        case "fullname":
          rows[editIndex]["fullname"] = newValue
          break
        case "email":
          rows[editIndex]["email"] = newValue
          break
        default:
          break
      }
      setRows([...rows])
    }
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1
  const isEditable = (id: number) => edit_id === id

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.id)
                const labelId = `enhanced-table-checkbox-${index}`
                const isItemEditable = isEditable(row.id)

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox" onClick={() => handleClick(row.id)}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="right">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      <div className="table-row-col">
                        {!isItemEditable ? (
                          <p>{row.fullname}</p>
                        ) : (
                          <input
                            value={row.fullname}
                            onChange={(e) => {
                              handleRowItemChange(e, "fullname")
                            }}
                            placeholder="fullname"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="table-row-col">
                        {!isItemEditable ? (
                          <p>{row.email}</p>
                        ) : (
                          <input
                            value={row.email}
                            onChange={(e) => {
                              handleRowItemChange(e, "email")
                            }}
                            placeholder="email"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="table-row-action">
                        <div onClick={() => handleRowAction(row.id)}>
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
    </Box>
  )
}

export default EnhancedTable
