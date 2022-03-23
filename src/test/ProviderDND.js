import React, {createContext, useContext} from 'react';
import { Text, View } from 'react-native';

const DND = createContext([])

export const useDND = () => {
    return useContext(DND)
}

const ProviderDND = ({children}) => {
    return(
        <DND.Provider>
            
        </DND.Provider>
    )
}

export default ProviderDND;
