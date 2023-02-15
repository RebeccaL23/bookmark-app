import { useState, useEffect } from 'react'
import './App.css'
import Bookmark from './components/bookmark'
import Form from './components/form'
import Pagination from './components/pagination'
import {nanoid} from "nanoid" // for custom created ids
import seed from "./seed" // "seed" file for default data
import { render } from 'react-dom'
// import styled, { keyframes } from "styled-components"

function App() {
  ////////////////////////// TYPES DEFINITION //////////////////////////
  // define individual bookmark type with properties: id, url, notes
  type Bookmark = {
    // readonly key: string,
    readonly id: string,
    lastEditedRaw: number,
    url: string
    lastEditedDate: string,
    notes?: string | null // optional field
  }

  ////////////////////////// INITIALISE STATES //////////////////////////
  // edit mode vs create mode
  const [editMode, setEditMode] = useState(false)

  const [editId, setEditId] = useState("")

  const [validationMsg, setValidationMsg] = useState(0)

  // bookmarks should be initialised with saved local storage, if any, even after reload
  const [bookmarks, setBookmarks] = useState(
    () => JSON.parse(localStorage.getItem("bookmarks")!) // lazy state initialisation via function so that this doesn't run repeatedly after any state changes
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

  // URL error messages & form validation


  function validation(e: React.SyntheticEvent){
    const urlInput = (document.getElementById("url-field") as HTMLInputElement).value
    const urlValidation = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    const regex = new RegExp(urlValidation)

    // this function works only for a few sites; CORS policy restricts this from working 100% of the time
    // function UrlExists(url: string) {
    //   var http = new XMLHttpRequest();
    //   http.open('HEAD', url, false);
    //   http.send();
    //   if (http.status != 404) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // console.log(UrlExists(urlInput))

    if (urlInput === "") {
      e.preventDefault()
      setValidationMsg(1)
      return;
    } else if ( bookmarks.find((o: Bookmark) => o.url === urlInput) ){ // duplicate url
      e.preventDefault()
      setValidationMsg(2)
      return;
    } else if (!urlInput.match(regex)) {
      e.preventDefault()
      setValidationMsg(3)
      return;
    // } else if (UrlExists(urlInput) === false) {
    //   console.log("ERROR4")
    //   e.preventDefault()
    //   setValidationMsg(4)
    //   return;
    } else {
      createBookmark()
      setValidationMsg(0)
    }
  }

  // convert Date to readable date
  function lastEdited(currentDate: Date) {
    return currentDate.getDate() + "/"
    + (currentDate.getMonth()+1)  + "/"
    + currentDate.getFullYear()
  }

  // create new bookmark
  function createBookmark() {
    const urlInput = (document.getElementById("url-field") as HTMLInputElement).value
    const notesInput = (document.getElementById("notes-field") as HTMLInputElement).value
    const currentDate = new Date();
    console.log('create')
    const newBookmark: Bookmark = {
        id: nanoid(),
        lastEditedRaw: currentDate.getTime(),
        lastEditedDate: lastEdited(currentDate),
        notes: notesInput,
        url: urlInput
    }
    // adds new bookmark to the bookmarks array
    setBookmarks((prevBookmarks: []) => [newBookmark, ...prevBookmarks])
  }

  // load existing bookmark in form on Edit click
  function loadBookmark(id: string) {
    // if bookmark id matches bookmark in array, then show the values of the bookmark in the form
    let urlInput = (document.getElementById("url-field") as HTMLInputElement)
    let notesInput = (document.getElementById("notes-field") as HTMLInputElement)
    setEditMode(true)

    bookmarks.map((bookmark: Bookmark) => {
      if (bookmark.id === id) {
        console.log(bookmark.id)
        urlInput.value = bookmark.url
        notesInput.value = bookmark.notes || ""
        setEditId(bookmark.id)
      }
    })
  }

  // edit bookmark
  function editBookmark(e: React.SyntheticEvent, id: any) {
    // e.preventDefault()

    e.stopPropagation()
    const currentDate = new Date()
    const urlInput = (document.getElementById("url-field") as HTMLInputElement)
    const notesInput = (document.getElementById("notes-field") as HTMLInputElement)

    setBookmarks((prevBookmarks: []) => prevBookmarks.reverse().map(bookmark => {
      if (bookmark["id"] === editId) {
        return {...(bookmark as Bookmark), lastEditedRaw: currentDate.getTime(), lastEditedDate: lastEdited(currentDate), url: urlInput.value, notes: notesInput.value}
      } else {
        return bookmark
      }
    }).sort(function(a, b) {
      var x = a["lastEditedRaw"]; var y = b["lastEditedRaw"];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }))
  }

  // delete bookmark
  function deleteBookmark(e: React.SyntheticEvent, id: string) {
    // find id of bookmark in bookmarks array & return new array of filtered out bookmark
    e.stopPropagation()
    setBookmarks((prevBookmarks: []) => prevBookmarks.filter(bookmark => bookmark["id"] !== id))
  }

  // delete all bookmarks
  function deleteAll(e: React.SyntheticEvent) {
    (document.getElementById("bookmark-form") as HTMLFormElement).reset()
    // e.stopPropagation()
    setEditMode(false)
    setBookmarks([])
    setValidationMsg(0)
  }

  ////////////////////////// PAGINATION //////////////////////////

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const indexOfLastBookmark = currentPage * recordsPerPage; // takes last bookmark on page X
  const indexOfFirstBookmark = indexOfLastBookmark - recordsPerPage; // takes first bookmark on page X
  const currentBookmarks = bookmarks.slice(indexOfFirstBookmark, indexOfLastBookmark); // shows only bookmarks between first and last indexed bookmark on page X
  const nPages = Math.ceil(bookmarks.length / recordsPerPage)

  // /////// STYLES based on state

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
    <div className={`App ${bookmarks.length === 0 ? "flex" : ""}`}>

      <div id="header">
        <h1 style={displayHeading}>Add a bookmark</h1>

        <Form
          bookmarks = {bookmarks}
          editMode = {editMode}
          editId = {editId}
          editBookmark = {editBookmark}
          validation = {validation}
          validationMsg = {validationMsg}
        />

      </div>

      <div className="data">
        <table style={displayTable}>

          <thead>
            <tr>
              <th>Last edited</th>
              <th>Bookmark</th>
              <th>Notes</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <Bookmark
            currentBookmarks = {currentBookmarks}
            loadBookmark = { loadBookmark }
            deleteBookmark = { deleteBookmark }
          />
        </table>
      </div>

      <div id='footer'>
        {bookmarks.length === 0 ? "" : <Pagination
          nPages = {nPages}
          currentPage = {currentPage}
          setCurrentPage = {setCurrentPage}
        />}

        <p id='remove-all' style={display} onClick={(event) => deleteAll(event)}>REMOVE ALL BOOKMARKS</p>
      </div>

    </div>
  )

}

export default App
