import { useState, useEffect } from 'react'
import './App.css'
// import Bookmark from './components/bookmark'
import Pagination from './components/pagination'
import {nanoid} from "nanoid" // for custom created ids
import seed from "./seed" // "seed" file for default data
import { render } from 'react-dom'


function App() {
  ////////////////////////// TYPES DEFINITION //////////////////////////
  // define url type and validate url is real
  type Url = {
    url: string
  }

  // define individual bookmark type with properties: id, url, notes
  type Bookmark = Url & {
    // readonly key: string,
    readonly id: string,
    lastEditedRaw: number,
    lastEditedDate: string,
    notes?: string | null// optional field
  }

  // define bookmarks as an array of objects

  ////////////////////////// INITIALISE STATES //////////////////////////
  // edit mode vs create mode
  const [editMode, setEditMode] = useState(false)

  const [editId, setEditId] = useState("")

  const [validationMsg, setValidationMsg] = useState(0)

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

  ////////////////////////// FUNCTIONS //////////////////////////

  ////////////////////////// URL error messages & form validation //////////////////////////
  // valid url
  // empty url
  // duplicate url
  // notes less than 100 characters

  function validation(event){
    const urlInput = document.getElementById("url-field").value
    const urlValidation = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(urlValidation)

    if (urlInput === "") {
      setValidationMsg(1)
      return;
    } else if ( bookmarks.find(o => o.url === urlInput) ){ // duplicate url
      setValidationMsg(2)
      return;
    } else if (!urlInput.match(regex)) {
      setValidationMsg(3)
      return;
    } else {
      console.log('OK')
      createBookmark()
      setValidationMsg(0)
    }
  }

  // const allBookmarks = bookmarks.map(bookmark => {
  //   return (
  //       <Bookmark
  //           id={bookmark.id}
  //           url={bookmark.url}
  //           notes={bookmark.notes}
  //           lastEdited={bookmark.lastEdited}
  //           onClick={props.loadBookmark(props.id)}
  //       />

  //   )
  // })

  // get time / date now
  function lastEdited(currentDate) {
    // currentdate.getHours() + ":"
    // + currentdate.getMinutes() + " on " +
    return currentDate.getDate() + "/"
    + (currentDate.getMonth()+1)  + "/"
    + currentDate.getFullYear()
  }

  // create new bookmark
  function createBookmark() {
    const urlInput = document.getElementById("url-field").value
    const notesInput = document.getElementById("notes-field").value
    const currentDate = new Date();
    // ensure new bookmark follows bookmark type
    const newBookmark: Bookmark = {
        // key: nanoid(),
        id: nanoid(),
        // get value from input form
        lastEditedRaw: currentDate.getTime(),
        lastEditedDate: lastEdited(currentDate),
        notes: notesInput,
        url: urlInput
    }
    // ensures prev bookmarks is an array, then adds the new bookmark
    setBookmarks((prevBookmarks: []) => [newBookmark, ...prevBookmarks])
  }

  // load existing bookmark in form
  function loadBookmark(event, id) {
    // if bookmark id matches bookmark in array, then show the values of the bookmark in the form
    const urlInput = document.getElementById("url-field")
    const notesInput = document.getElementById("notes-field")
    setEditMode(true)

    bookmarks.map(bookmark => {
      if (bookmark.id === id) {
        urlInput.value = bookmark.url
        notesInput.value = bookmark.notes || ""
        setEditId(bookmark.id)
      }
    })
  }

  // sort bookmarks array by last edited (raw data) key in objects
  function sortByDate(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  // edit bookmark
  function editBookmark(event, id, callback) {
    // event.preventDefault()
    event.stopPropagation()
    const currentDate = new Date()
    const urlInput = document.getElementById("url-field")
    const notesInput = document.getElementById("notes-field")

    setBookmarks(prevBookmarks => prevBookmarks.map(bookmark => {
      if (bookmark.id === id.editId) {
        return {...bookmark, lastEditedRaw: currentDate.getTime(), lastEditedDate: lastEdited(currentDate), url: urlInput.value, notes: notesInput.value}
      } else {
        return bookmark
      }
    }))

    // sortByDate(bookmarks, 'lastEditedRaw')
  }

  // delete bookmark
  function deleteBookmark(event, id: string) {
    // find id of bookmark in bookmarks array & splice
    event.stopPropagation()
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id))
  }

  // delete all bookmarks
  function deleteAll(event) {
    event.stopPropagation()
    setBookmarks([])
  }

  ////////////////////////// PAGINATION //////////////////////////

  // https://levelup.gitconnected.com/a-simple-guide-to-pagination-in-react-facd6f785bd0

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLastBookmark = currentPage * recordsPerPage; // takes last bookmark on page X
  const indexOfFirstBookmark = indexOfLastBookmark - recordsPerPage; // takes first bookmark on page X
  const currentBookmarks = bookmarks.slice(indexOfFirstBookmark, indexOfLastBookmark); // shows only bookmarks between first and last indexed bookmark on page X
  const nPages = Math.ceil(bookmarks.length / recordsPerPage)

  /////// STYLES based on state
  const fieldDefault = {
    borderBottom: bookmarks === true ? "#fff 2px solid" : "#000 2px solid"
  }

  const submitDefault = {
    background: false ? "#fff" : "#000",
    color: false ? "#000" : "#fff"
  }

  const displayTable = {
    display: bookmarks.length === 0 ? "none" : "table"
  }

  const display = {
    display: bookmarks.length === 0 ? "none" : "block"
  }

  const displayHeading = {
    display: bookmarks.length === 0 ? "block" : "none"
  }

  return (
    <div className="App">

      <div id="header">
        <h1 style={displayHeading}>Add a bookmark</h1>

        <form id='bookmark-form' className={bookmarks.length === 0 ? 'form-default' : 'form-top'}>
          <input id='url-field' type="url" name="url" placeholder="Enter bookmark link" style={fieldDefault}></input>
          <input id='notes-field' type="text" name="notes" placeholder="Leave a note. 100 characters or less." style={fieldDefault}></input>
          { editMode ?
            <button className='btn' id='edit-button' style={submitDefault} onClick={(event) => editBookmark(event, {editId})} >Edit</button> :
            <button className='btn' id='submit-button' style={submitDefault} onClick={validation} >Save</button>
          }
          { validationMsg === 1
          ? <p className="validation">Empty url.</p>
          : validationMsg === 2
            ? <p className="validation">Duplicate url</p>
            : validationMsg === 3 ? <p className="validation">That's not a url</p> : createBookmark()
          }
        </form>
      </div>

      <table style={displayTable}>

        <thead>
          <tr>
            <th>Last edited</th>
            <th>Bookmark</th>
            <th>Notes</th>
          </tr>
        </thead>

        {/* { bookmarks.map((bookmark: Bookmark) => {
          return (
            <tbody>
              <tr>
                <td>{bookmark.lastEdited}</td>
                <td><a target="_blank" href={bookmark.url}>{bookmark.url}</a></td>
                <td>{bookmark.notes}</td>
                <td id="edit" onClick={(event) => loadBookmark(event, bookmark.id)}>Edit</td>
                <td id="delete" onClick={(event) => deleteBookmark(event, bookmark.id)}>Delete</td>
              </tr>
            </tbody>
          )
        })} */}

        {currentBookmarks.map((bookmark: Bookmark) => (
          <tbody>
            <tr>
              <td>{bookmark.lastEditedDate}</td>
              <td><a target="_blank" href={bookmark.url}>{bookmark.url}</a></td>
              <td>{bookmark.notes}</td>
              <td id="edit" onClick={(event) => loadBookmark(event, bookmark.id)}>Edit</td>
              <td id="delete" onClick={(event) => deleteBookmark(event, bookmark.id)}>Delete</td>
            </tr>
          </tbody>
        ))}

      </table>

      <div id='footer'>

        <Pagination
          nPages = {nPages}
          currentPage = {currentPage}
          setCurrentPage = {setCurrentPage}
        />

        <p id='remove-all' style={display} onClick={(event) => deleteAll(event)}>REMOVE ALL BOOKMARKS</p>
      </div>

    </div>
  )
}

export default App
