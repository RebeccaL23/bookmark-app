import { useState } from 'react'

interface Props {
  currentBookmarks: [],
  loadBookmark: Function,
  deleteBookmark: Function
};

type Bookmark = {
  // readonly key: string,
  readonly id: string,
  lastEditedRaw: number,
  url: string
  lastEditedDate: string,
  notes?: string | null // optional field
}

const Bookmark: React.FC<Props> = ({currentBookmarks, loadBookmark, deleteBookmark}) => {
  return(
    <>
      {currentBookmarks.map((bookmark: Bookmark) => (
        <tbody>
          <tr>
            <td>{bookmark.lastEditedDate}</td>
            <td><a target="_blank" href={bookmark.url}>{bookmark.url}</a></td>
            <td>{bookmark.notes}</td>
            <td id="edit" onClick={(event) => loadBookmark(bookmark.id)}>Edit</td>
            <td id="delete" onClick={(event) => deleteBookmark(event, bookmark.id)}>Delete</td>
          </tr>
        </tbody>
      ))}

    </>
  )
}

export default Bookmark
