import React, { useState, useEffect } from "react"
import { CUIAutoComplete } from "chakra-ui-autocomplete"
import firebase from "gatsby-plugin-firebase"
import "firebase/firestore"

export default function Search({ selectedItems, setSelectedItems }) {
  // React hook to handle the pickerItems state
  const [pickerItems, setPickerItems] = useState([{}])

  // only runs on component mount
  useEffect(() => {
    // firebase ref
    const db = firebase.firestore()
    // array of options
    let qualifications = []
    // get data from firebase
    db.collection("qualifications")
      .get()
      .then(querySnapshot => {
        // handle data in callback
        querySnapshot.forEach(doc => {
          // push as value label pairs into array
          qualifications.push({
            value: doc.id,
            label: doc.data().label,
          })
        })
        // update picker
        setPickerItems(qualifications)
      })
  }, [])

  //Creates a custom qualification
  const handleCreateItem = item => {
    setPickerItems(curr => [...curr, item])
    setSelectedItems(curr => [...curr, item])
  }

  //Add/Delete the qualification
  const handleSelectedItemsChange = selectedItems => {
    if (selectedItems) {
      setSelectedItems(selectedItems)
      console.log(selectedItems)
    }
  }

  return (
    <CUIAutoComplete
      label="Input all relevant qualifications"
      placeholder="Type a qualification"
      onCreateItem={handleCreateItem}
      items={pickerItems}
      selectedItems={selectedItems}
      onSelectedItemsChange={changes =>
        handleSelectedItemsChange(changes.selectedItems)
      }
    />
  )
}
