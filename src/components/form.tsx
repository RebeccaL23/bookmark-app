import { useState } from 'react'

interface Props {
  bookmarks: [],
  editMode: boolean,
  editBookmark: Function,
  validation: Function,
  validationMsg: number
  editId: string
};

const Form: React.FC<Props> = ({bookmarks, editMode, editBookmark, validation, validationMsg, editId}) => {

/////// STYLES based on state
const submitDefault = {
  background: false ? "#fff" : "#000",
  color: false ? "#000" : "#fff"
}

return (
  <>
    <form id='bookmark-form' className={bookmarks.length === 0 ? 'form-default' : 'form-top'}>
      <input id='url-field' type="text" name="url" placeholder="Enter bookmark link"></input>
      <input id='notes-field' type="text" name="notes" placeholder="Leave a note"></input>
      { editMode
        ? <button className='btn' id='edit-button' style={submitDefault} onClick={(event) => editBookmark(event, {editId})} >Edit</button>
        : <button className='btn' id='submit-button' style={submitDefault} onClick={(event) => validation(event)} >Save</button>
      }
      { validationMsg === 1
      ? <p className="validation">HMM, THAT LOOKS EMPTY.</p>
      : validationMsg === 2
        ? <p className="validation">MUST BE GOOD–YOU'VE ALREADY SAVED THAT.</p>
        : validationMsg === 3
          ? <p className="validation">HEY, THAT'S NOT A VALID LINK.</p>
          // : validationMsg === 4
          //   ? <p className="validation">DOESN'T LOOK LIKE THAT PAGE EXISTS...</p>
            : ""
      }
    </form>
  </>
)
}

export default Form
