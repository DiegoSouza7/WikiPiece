import React from 'react'
import { useHistory } from 'react-router-dom'
import Pagination from '@material-ui/lab/Pagination'

import './styles.css'

export default function PaginationRounded({ total, entidade }) {
  const history = useHistory()
  const [page, setPage] = React.useState(1)

  const handleChange = (event, value) => {
    setPage(value)
    history.push(`/${entidade}${value}`)
  }

  return (
    <div>
      <Pagination
        count={total}
        page={page}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
      />
    </div>
  )
}