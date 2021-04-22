import { FC } from 'react';
import { sentenceCase } from 'change-case';
import Moment from 'react-moment'

import Spinner from './Spinner';
import Skeleton from './Skeleton';

interface Action {
  onClick: (id: string) => void
  name: string
}

export enum HeadingType {
  Text,
  Date
}

interface Heading {
  name: string
  type: HeadingType
}

export interface TableProps {
  className?: string
  headings: Heading[]
  content?: { [key: string]: any }[]
  title?: string
  actions?: Action[]
  placeholder: string
}

const Table: FC<TableProps> = ({ className = '', actions = [], headings, content, title, placeholder }) => {

  return <div className={`flex flex-col ${className}`}>
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow-sm overflow-hidden border border-gray-200 rounded sm:rounded-lg">
          {title ? <div className="py-5 px-6 w-full bg-white border-b border-gray-200">
            <h1 className="text-xl leading-6 font-semibold text-gray-900">{title}</h1>
          </div> : null}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headings.map((heading, i) => (<th scope="col" className={`px-6 pt-4 pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${i > 1 ? 'hidden sm:table-cell' : ''}`}>
                  {sentenceCase(heading.name)}
                </th>))}
                {actions.map(action => (<th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{action.name}</span>
                </th>))}
              </tr>
            </thead>
            {content && content.length > 0 ?
              <tbody className="bg-white divide-y divide-gray-200">
                {content.map((row, r) => (
                  <tr key={row.id}>
                    { headings.map((heading, i) => (
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${i === 0 ? 'font-medium' : ''} ${i > 1 ? 'hidden sm:table-cell' : ''}`}>
                        {(() => {
                          if (!row[heading.name]) return <Skeleton width="100%" opacity={1 - (1 / (content.length + 1)) * (r + 1)} />;
                          if (heading.type === HeadingType.Text) return row[heading.name]
                          if (heading.type === HeadingType.Date) return <Moment fromNow>{row[heading.name]}</Moment> 
                        })()}
                      </td>
                    ))}
                    { actions.map(action => (
                      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => action.onClick(row.id)} className="text-primary-600 hover:text-primary-900 py-1 px-2 hover:bg-gray-50 rounded">
                          {action.name}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              : null}
          </table>
          {content && content.length === 0 ?
            <div className="py-5 px-6 w-full flex justify-center bg-white border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase py-1">{placeholder}</p>
            </div>
            : !content ? <div className="py-5 px-6 w-full flex justify-center bg-white border-t border-gray-200"><Spinner size="6" /></div> : null
          }
        </div>
      </div>
    </div>
  </div>;
}

export default Table;