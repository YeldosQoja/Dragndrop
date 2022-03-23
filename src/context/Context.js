import React, { createContext, useContext, useState} from 'react';
import { Text, View } from 'react-native';
import { DROPBOX_HEIGHT } from '../components/Utils';

const Context = createContext([])

export const getContext = () => {
    return useContext(Context)
}

const Provider = ({children}) => {

    const [height, setHeight] = useState(DROPBOX_HEIGHT)

    return(
        <Context.Provider
            value={{
                height, setHeight
            }}
        >
            {children}
        </Context.Provider>
    );
}

export default Provider;
