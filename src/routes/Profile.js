import { authService, dbService } from "fbase"
import {useHistory} from "react-router-dom"
import React, { useEffect, useState } from "react"

export default ({userObj})=> {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () =>
    {
        authService.signOut();
        history.push("/");
    } ;
    
    const getMyNweets = async() =>{
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createAt")
            .get();
    };

    useEffect(()=>{
        getMyNweets();

    },[]);

    const onChange = (event) =>{
        const {
            target: {value},            
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) =>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile(
                {
                    displayName:newDisplayName,
                });
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>            
        </>
    );
};