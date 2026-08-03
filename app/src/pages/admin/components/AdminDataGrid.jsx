import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function AdminDataGrid({
  rows,
  columns,
  loading = false,
  height,
  pageSize = 25,
  pageSizeOptions = [10, 25, 50],
}) {
  return (
    <Box sx={{ height: height ?? { xs: 400, md: 500 } }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        disableRowSelectionOnClick
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      />
    </Box>
  );
}
