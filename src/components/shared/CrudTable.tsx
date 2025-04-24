import React from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
interface Column {
  header: string;
  accessor: string;
}
interface CrudTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}
const CrudTable = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete
}: CrudTableProps) => {
  return <div className="bg-white rounded shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        <button onClick={onAdd} className="bg-emerald-500 text-white px-3 py-1 rounded flex items-center">
          <PlusIcon size={16} className="mr-1" /> Ajouter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(column => <th key={column.accessor} className="p-3 text-left text-sm font-medium text-gray-500">
                  {column.header}
                </th>)}
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => <tr key={index} className="border-t">
                {columns.map(column => <td key={column.accessor} className="p-3">
                    {item[column.accessor]}
                  </td>)}
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button onClick={() => onEdit(item)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <PencilIcon size={16} />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export default CrudTable;