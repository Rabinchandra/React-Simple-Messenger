import React, { useEffect, useState } from "react";

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("conversationId");
});

function Chat({ db }) {
  const [friends, setFriends] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [inputMsg, setInputMsg] = useState("");

  let [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    // sessionStorage.removeItem("user");
    loadFriends();

    // Real time database
    db.collection("users")
      .doc(user.id)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        // Update user with updated values
        setUser({
          id: snapshot.id,
          name: data.name,
          friends: data.friends,
        });

        const conversationId = sessionStorage.getItem("conversationId");

        if (conversationId !== null) {
          const currentFriend = data.friends.find(
            (f) => f.id === conversationId
          );

          setCurrentConversation(currentFriend.textMsg);
        }
      });
  }, []);

  // Load friends from firebase and update friends state
  const loadFriends = () => {
    db.collection("users")
      .get()
      .then((snapshots) => {
        const list = [];
        snapshots.docs.forEach((f) => {
          // Appending all the users except the current user
          if (user.id !== f.id) {
            list.push({ id: f.id, name: f.data().name });
          }
        });
        setFriends(list);
      });
  };

  // Show current conversation by clicking a friend
  const onClickFriend = (e) => {
    const friendId = e.target.getAttribute("data-id");

    // Update current conversation id
    // currentConversationId = friendId;
    sessionStorage.setItem("conversationId", friendId);
    setConversationId(friendId);

    // Get the message from user's friends
    displayMsgText(friendId);

    // styling friend being clicked
    styleFriendDiv(e.target);
  };

  // Display Message Text
  const displayMsgText = (id) => {
    // Get the friend obj
    const friend = user.friends.find((f) => f.id == id);

    if (!friend) {
      // Add a friend object to the firebase
      addFriend(user.id, id);
      addFriend(id, user.id);
    } else {
      // console.log("Show text");
      setCurrentConversation(friend.textMsg);
    }
  };

  const addFriend = (firstId, secondId) => {
    db.collection("users")
      .get()
      .then((snapshots) => {
        // Get the first user and its friend list
        const res = snapshots.docs.find((s) => s.id === firstId);
        return res.data().friends;
      })
      .then((friendList) => {
        // update friend list
        friendList.push({
          id: secondId,
          textMsg: [],
        });

        db.collection("users").doc(firstId).update({
          friends: friendList,
        });
      });
  };

  const styleFriendDiv = (e) => {
    const friendList = document.querySelectorAll(".friend-list li");
    friendList.forEach((item) => item.classList.remove("active"));

    e.classList.add("active");
  };

  // Add Message to firebase
  const addMessage = (firstId, secondId, senderId) => {
    // Get the user with first id
    // Search the friendObj with seoncdId from friends list
    // Push the message to the chat list
    // Update the chat
    db.collection("users")
      .get()
      .then((snapshots) => {
        const found = snapshots.docs.find((d) => d.id === firstId);
        return found.data();
      })
      .then((firstUser) => {
        console.log(firstUser);
        const friends = firstUser.friends;
        const found = friends.find((f) => f.id === secondId);
        const index = friends.indexOf(found);

        if (index !== -1) {
          friends[index].textMsg.push({ id: senderId, text: inputMsg });

          db.collection("users").doc(firstId).update({
            friends: friends,
          });
        }
      });
  };

  const sendMessage = () => {
    addMessage(user.id, conversationId, user.id);
    addMessage(conversationId, user.id, user.id);
  };

  const updateInputMsg = (e) => {
    setInputMsg(e.target.value);
  };

  const onSendBtnClick = () => {
    sendMessage();
    clearMsgInput();
  };

  const clearMsgInput = () => {
    document.querySelector(".msg-input").value = "";
    setInputMsg("");
  };

  return (
    <React.Fragment>
      <div className="profile container p-5">
        <h3>{user.name}</h3>
      </div>
      <div className="chat container d-flex justify-content-around">
        {!user ? (
          "Login First"
        ) : (
          <React.Fragment>
            <ul className="friend-list list-group w-50">
              {!friends.length
                ? ""
                : friends.map((f) => (
                    <li
                      key={f.id}
                      data-id={`${f.id}`}
                      className="list-group-item list-group-item-action"
                      onClick={onClickFriend}>
                      {f.name}
                    </li>
                  ))}
            </ul>
            <div className="conversation w-50 p-4">
              {!currentConversation ? (
                "No conversation"
              ) : (
                <React.Fragment>
                  <div className="conversation-text-container">
                    {currentConversation.map((msgObj) => (
                      <React.Fragment>
                        {msgObj.id === user.id ? (
                          <div key={msgObj.id} className="msg-text sender-msg">
                            <span>{msgObj.text}</span>
                          </div>
                        ) : (
                          <div
                            key={msgObj.id}
                            className="msg-text receiver-msg">
                            <span>{msgObj.text}</span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="msg-input-container">
                    <div>
                      <input
                        type="text"
                        className="msg-input form-control"
                        placeholder="Type message here..."
                        onChange={updateInputMsg}
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn-primary btn-send"
                        onClick={onSendBtnClick}>
                        Send
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default Chat;
