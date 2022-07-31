import * as React from "react"
import Box from "@mui/material/Box"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Checkbox from "@mui/material/Checkbox"
import { visuallyHidden } from "@mui/utils"
import { MemberParam } from "../../models/member"
import { HeadCellParam, OrderParam } from "../../models/table"

const headCells: readonly HeadCellParam[] = [
  {
    id: "_id",
    numeric: false,
    disablePadding: true,
    label: "No",
  },
  {
    id: "fullname",
    numeric: false,
    disablePadding: false,
    label: "Fullname",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: true,
    label: "Gender",
  },
  {
    id: "birthday",
    numeric: false,
    disablePadding: false,
    label: "Birthday",
  },
  {
    id: "job",
    numeric: false,
    disablePadding: false,
    label: "Job",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof MemberParam) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: OrderParam
  orderBy: string
  rowCount: number
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof MemberParam) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  const isSortable = (key: keyof MemberParam) => {
    const sortableOptions = ["fullname", "email", "gender", "birthday"]
    if (sortableOptions.includes(key)) {
      return true
    }
    return false
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <React.Fragment key={index}>
            {isSortable(headCell.id) ? (
              <TableCell
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : (
              <TableCell
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "normal"}
              >
                {headCell.label}
              </TableCell>
            )}
          </React.Fragment>
        ))}
        <TableCell align="right">Action</TableCell>
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
