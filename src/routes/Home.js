import React, { useState, useEffect } from "react";
import { dbService, storageService } from "firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import Tweets from "components/Tweets";

function Home({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    dbService.collection("tweets").onSnapshot((snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      // first we need to upload the photo
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const fileUpload = await fileRef.putString(attachment, "data_url");

      // then copy the url of the photo
      attachmentUrl = await fileUpload.ref.getDownloadURL();
    }
    // then we upload the tweet
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("tweets").add(tweetObj);
    setTweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img alt={tweet.text} src={attachment} width="600px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      {tweets.map((tweet) => (
        <Tweets
          key={tweet.id}
          tweet={tweet}
          isOwner={tweet.creatorId === userObj.uid}
        />
      ))}
    </div>
  );
}
export default Home;
