import * as React from "react"
import { alpha } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import { observer } from "mobx-react"
import { otherStore } from "../../store"
import { MemberParam } from "../../models/member"
import _ from "lodash"

const apiClient = ApiClient.getInstance()

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: string[]
  rows: MemberParam[]
  setRows: (val: MemberParam[]) => void
  setSelected: (val: string[]) => void
  setShowCreateDialog: (val: boolean) => void
}

const EnhancedTableToolbar = ({
  numSelected,
  selected,
  rows,
  setRows,
  setSelected,
  setShowCreateDialog,
}: EnhancedTableToolbarProps) => {
  const { setLoading, setToastParams } = otherStore

  const onDelete = async (e: React.MouseEvent<unknown>) => {
    e.preventDefault()

    setLoading(true)
    let msg = `${numSelected} row(s) deleted.`,
      isFailed = false

    try {
      const results = await apiClient.post<{ deleted: number }>(
        `${Config.BASE_URL}/members/delete`,
        { ids: selected }
      )
      if (results.deleted) {
        _.remove(rows, (o) => selected.includes(o._id))
        setRows([...rows])
        setSelected([])
      } else {
        msg = "Nothing has been deleted."
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Something went wrong to delete row(s)."
      isFailed = true
    } finally {
      setLoading(false)
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
    }
  }

  const onCreate = (e: React.MouseEvent<unknown>) => {
    e.preventDefault()
    setShowCreateDialog(true)
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          Members
        </Typography>
      )}
      {numSelected > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Tooltip title="Delete" onClick={onDelete}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list" onClick={onCreate}>
          <IconButton>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default observer(EnhancedTableToolbar)
