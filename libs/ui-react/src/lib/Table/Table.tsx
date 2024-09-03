import { ReactNode } from 'react';
import MuiTable, { TableProps as MuiTableProps } from '@mui/material/Table';

import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHead from './TableHead';
import TableRow from './TableRow';
import TableContainer from './TableContainer';
import Paper from '../Paper/Paper';
import { generateTestDataAttr } from '../utilities/test';

export type TableHeaders = {
  name: string;
  label: string;
}[];
export type TableData = Record<string, ReactNode>[];

export type TableProps = MuiTableProps & {
  headers?: TableHeaders | Readonly<TableHeaders>;
  rows?: TableData;
  footer?: ReactNode;
};

export function Table({ headers, rows, footer, ...rest }: TableProps) {
  return (
    <TableContainer>
      <MuiTable {...rest}>
        <TableHead sx={{ backgroundColor: 'lightgray' }}>
          <TableRow>
            {headers?.map((header) => (
              <TableCell key={header.name} data-test={generateTestDataAttr('table-header', header.label)}>
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, i) => (
            <TableRow key={i} data-test={generateTestDataAttr('table-row', i.toString())}>
              {headers?.map((header) => (
                <TableCell key={header.name} data-test={generateTestDataAttr('table-data', header.label)}>
                  {row[header.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {footer}
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
