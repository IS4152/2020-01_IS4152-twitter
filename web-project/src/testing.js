import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { Data } from './Data/test.json';
import { Table } from 'react-bootstrap';

const newdata = Data.map((data) => {
    return (
        <table>
            <tr>
                <th>{data.key}</th>
            </tr>

        </table>
    )
})