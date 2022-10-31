import { dbService, storageService } from "fbase";
import {v4 as uuidv4} from "uuid";
import React, { Children, useEffect, useState } from "react";
import Nweet from "components/Nweet";


const Home = ({userObj})=> {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    /*
    const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
        const nweetObject = {
            ...document.data(),
            id: document.id,
        };
        setNweets((prev) => [nweetObject, ...prev]);
        });
    };
    */

    useEffect(()=>{        
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "")
        {
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);        
            const response = await fileRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
       
        const nweetObj = {
            text:nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }

        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
        //     text:nweet,
        //     createAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        
    }
    const onChange = (event) => {
        //console.log(event.target.value)
        const {
            target:{value},
        } = event;
        setNweet(value);
    };

    const onFileChange= (event) =>{
        //console.log(event)
        const {target: {files},} = event;
        const theFile = files[0];
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) =>{
            console.log(finishedEvent);
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result)
        }
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = ()=> setAttachment(null);

    return (        
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={nweet} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange}></input>
                <input type="submit" value="Nweet" />
                
                {attachment && 
                    (
                        <div>
                            <img src={attachment} width="50px" height="50px" />     
                            <button onClick={onClearAttachment}>Clear</button>                   
                        </div>
                    )
                }

            </form>
            <div>
                {nweets.map(nweet =>
                   <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                    )}
            </div>
        </div>
    );
};
export default Home;