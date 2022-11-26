import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchFeedback()
  }, [])

  //fetch feedback from database backend
  const fetchFeedback = async () => {
    const response = await fetch(`/feedback?_sort=id&_order=desc`);
    const data = await response.json();

    setFeedback(data)
    setIsLoading(false)
  }

  // Deletes feedback
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete this my good friend?')) {
      await fetch(`/feedback/${id}`, { method: 'DELETE' })
      setFeedback(feedback.filter((item) => item.id !== id))
    }
  }
  // Update Feedback item
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updItem)
    })

    const data = await response.json()

    setFeedback(feedback.map((item) => item.id === id ? { ...item, ...data } : item))
  }

  // add feedback
  const addFeedback = async (newFeedback) => {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newFeedback)
    })

    const data = await response.json()

    setFeedback([data, ...feedback])
  }

  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    })
  }
  // set itm to be updated 
  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }
      }>
      {children}
    </FeedbackContext.Provider >
  )
}

export default FeedbackContext;