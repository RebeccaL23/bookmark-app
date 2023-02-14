import { useState } from 'react'

export default function Bookmark(props)  {
  ////////////////////////// INITIALISE STATES //////////////////////////
  // bookmarks should be initialised with saved local storage, if any, even after reload
  const [bookmarks, setBookmarks] = useState(
    () => JSON.parse(localStorage.getItem("bookmarks")) // lazy state initialisation via function so that this doesn't run repeatedly after any state changes
    || seed // seed file to input default data
  )

  const [currentBookmarkId, setCurrentBookmarkId] = useState(
    // initialises as the first bookmark's id or an empty string, if bookmark is not empty
    (bookmarks[0] && bookmarks[0].id) || ""
    )

    // every time the bookmarks array changes, then run the function to set local storage (key = bookmarks, value = bookmarks array stringified)
    useEffect(() => {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    }, [bookmarks])

  return (
    <>
      <tbody>
        <tr>
          <td>{props.lastEdited}</td>
          <td><a target="_blank" href={props.url}>{props.url}</a></td>
          <td>{props.notes}</td>
          <td id="edit" onClick={(event) => loadBookmark(event, bookmark.id)}>Edit</td>
          <td id="delete" onClick={props.deleteBookmark(props.id) }>Delete</td>
        </tr>
      </tbody>
    </>
  )
}
