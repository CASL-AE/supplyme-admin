import { combineReducers } from 'redux';

const addValor = (state, action) => {
    switch (action.type) {
        case 'ADD_VALOR':
          return {
            valorID: action.valorID,
            active: action.active,
            deleted: action.deleted,
            name: action.name,
            avatar: action.avatar,
            birthDate: action.birthDate,
            deathDate: action.deathDate,
            notes: action.notes,
            createdTime: action.createdTime,
            updatedTime: action.updatedTime,
          }
        default:
            return state
    }
}

const valors = (state = [], action) => {
    switch (action.type) {
        case 'ADD_VALOR':
            if (state.map(v => v.valorID).includes(action.valorID)) {
              return [
                addValor(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addValor(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_VALORS_LISTENER_REQUEST':
        return null;
    case 'START_FETCHING_VALORS':
        return state;
    case 'ADD_VALOR':
        return null;
    case 'RECEIVED_VALORS':
        return Date.now();

    default:
        return state;
    }
};

const valorData = combineReducers({
    valors,
    receivedAt,
});

export default valorData;
