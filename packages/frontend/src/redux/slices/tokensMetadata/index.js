import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import FungibleTokens from '../../../services/FungibleTokens';
import createParameterSelector from '../../selectors/mainSelectors/createParameterSelector';

const SLICE_NAME = 'tokensMetadata';

const initialState = {
    byContractName: {}
};

export async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName });
}

const tokensMetadataSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['byContractName', contractName], metadata);
        }
    }
});

export default tokensMetadataSlice;

export const actions = {
    ...tokensMetadataSlice.actions
};
export const reducer = tokensMetadataSlice.reducer;

// Top level selectors
const selectTokensMetadataSlice = (state) => state[SLICE_NAME] || initialState;

const getContractNameParam = createParameterSelector((params) => params.contractName);

export const selectContractsMetadata = createSelector(selectTokensMetadataSlice, ({ byContractName }) => byContractName || {});

export const selectOneContractMetadata = createSelector(
    [selectContractsMetadata, getContractNameParam],
    (metadataByContractName, contractName) => metadataByContractName[contractName]
);
