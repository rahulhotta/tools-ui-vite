'use client'
import type { ReactNode } from 'react';
import {store} from './store.ts';
import { Provider } from 'react-redux';
interface ReduxProviderProps {
  children: ReactNode;
}
const Providers = ({ children }: ReduxProviderProps) => {
    return <Provider store={store}>{children}</Provider>
}

export default Providers;