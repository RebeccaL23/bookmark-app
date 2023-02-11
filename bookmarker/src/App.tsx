import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {nanoid} from "nanoid"
import seed from "./seed"


function App() {

  ////////////////////////// TYPES DEFINITION //////////////////////////
  // define url type and validate url is real
  type Url = {
    url: string
  }

  // define individual bookmark type with properties: id, url, notes
  type Bookmark = Url & {
    readonly key: string,
    readonly id: string,
    lastEdited: string,
    notes?: string // optional field
  }

  // define bookmarks as an array of objects

  ////////////////////////// URL error messages & form validation //////////////////////////
  // valid url
  // duplicate url
  // notes less than 100 characters

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

  ////////////////////////// FUNCTIONS //////////////////////////
  // get time / date now
  function lastEdited() {
    var currentdate = new Date();

    // currentdate.getHours() + ":"
    // + currentdate.getMinutes() + " on " +
    return currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear()
  }

  // create new bookmark
  function createBookmark() {
    const urlInput = document.getElementById("url-field").value
    const notesInput = document.getElementById("notes-field").value

    // ensure new bookmark follows bookmark type
    const newBookmark: Bookmark = {
        key: nanoid(),
        id: nanoid(),
        // get value from input form
        lastEdited: lastEdited(),
        notes: notesInput,
        url: urlInput
    }
    // ensures prev bookmarks is an array, then adds the new bookmark
    setBookmarks((prevBookmarks: []) => [newBookmark, ...prevBookmarks])
  }

  // edit bookmark
  function editBookmark(url: Url, notes: string) {
    setBookmarks((prevBookmarks: []) => prevBookmarks.map((prevBookmark: {}) => {
        return prevBookmark.id === currentBookmarkId
            ? { ...prevBookmark, lastEdited: lastEdited(), url: url, notes: notes }
            : prevBookmark
    }))
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
  // https://hygraph.com/blog/react-pagination
  const [currentPage, setCurrentPage] = useState(1);
  const bookmarksPerPage = 20;

  const indexOfLastBookmark = currentPage * bookmarksPerPage;
  const indexOfFirstPost = indexOfLastBookmark - bookmarksPerPage;
  const currentPosts = bookmarks.slice(indexOfFirstPost, indexOfLastBookmark);

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
      <h1 style={displayHeading}>Add a bookmark</h1>
      <form id='bookmark-form' className={bookmarks.length === 0 ? 'form-default' : 'form-top'}>
        <input id='url-field' type="url" name="url" placeholder="Enter bookmark link" style={fieldDefault}></input>
        <input id='notes-field' type="text" name="notes" placeholder="Leave a note. 100 characters or less." style={fieldDefault}></input>
        <button className='btn' id='submit-button' style={submitDefault} onClick={() => createBookmark()} >Save</button>
        {/* <p>Error Message</p> */}
      </form>
      <table style={displayTable}>
        <thead>
          <tr>
            <th>Last edited</th>
            <th>Bookmark</th>
            <th>Notes</th>
          </tr>
        </thead>

          {bookmarks.map((bookmark: Bookmark) => (
            <tbody>
              <tr>
                <td>{bookmark.lastEdited}</td>
                <td><a target="_blank" href={bookmark.url}>{bookmark.url}</a></td>
                <td>{bookmark.notes}</td>
                <td id="edit" >Edit</td>
                <td id="delete" onClick={(event) => deleteBookmark(event, bookmark.id)}>Delete</td>
              </tr>
            </tbody>
          ))}

      </table>
      <div id='footer'>
        <div id='pagination'>1, 2, 3</div>
        <p id='remove-all' style={display} onClick={(event) => deleteAll(event)}>Remove all bookmarks</p>
      </div>
    </div>
  )
}

export default App
