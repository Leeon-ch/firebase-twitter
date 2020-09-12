import { dbService, storageService } from "firebaseConfig";
import React, { useState } from "react";

function Tweets({ tweet, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet.text);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditedTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("tweets").doc(`${tweet.id}`).update({
      text: editedTweet,
    });
    toggleEditing();
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you wanna delete");
    if (ok) {
      await dbService.collection("tweets").doc(`${tweet.id}`).delete();
      await storageService.refFromURL(`${tweet.attachmentUrl}`).delete();
    }
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              maxLength={120}
              required
              onChange={onChange}
              value={editedTweet}
            />
            <input type="submit" value="Update Tweet" />
            <button onClick={onDeleteClick}>Delete Tweet</button>
          </form>
          <button onClick={toggleEditing}>cancel</button>
        </>
      ) : (
        <>
          <h4>{tweet.text} </h4>
          {tweet.attachmentUrl !== "" ? (
            <img alt={tweet.text} src={tweet.attachmentUrl} width={600} />
          ) : (
            <></>
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit Tweet</button>
              <button onClick={onDeleteClick}>Delete Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Tweets;
