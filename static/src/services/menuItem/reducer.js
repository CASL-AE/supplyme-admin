import { combineReducers } from 'redux';
import { getMenuItemFromSnapshot } from './model';

const addMenuItem = (state, action) => {
    switch (action.type) {
        case 'ADD_MENUITEM':
          return getMenuItemFromSnapshot(action)
        default:
            return state
    }
}

const menuItems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MENUITEM':
            if (state.map(menuItem => menuItem.itemID).includes(action.itemID)) {
              return [
                addMenuItem(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addMenuItem(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_MENUITEMS_LISTENER_MENUITEM':
        return null;
    case 'START_FETCHING_MENUITEMS':
        return state;
    case 'ADD_MENUITEM':
        return null;
    case 'RECEIVED_MENUITEMS':
        return Date.now();

    default:
        return state;
    }
};

const addPublicMenuItem = (state, action) => {
    switch (action.type) {
        case 'ADD_PUBLIC_MENUITEM':
          return getMenuItemFromSnapshot(action)
        default:
            return state
    }
}

const publicMenuItems = (state = [], action) => {
    switch (action.type) {
        case 'ADD_PUBLIC_MENUITEM':
            if (state.map(menuItem => menuItem.itemID).includes(action.itemID)) {
              return [
                addPublicMenuItem(undefined, action)
              ]
            }else{
                return [
                  ...state,
                  addPublicMenuItem(undefined, action)
                ]
            }
        default:
            return state
    }
};

const receivedPublicMenuItemsAt = (state = null, action) => {
    switch (action.type) {
    case 'UNMOUNT_MENUITEMS_LISTENER_MENUITEM':
        return null;
    case 'START_FETCHING_PUBLIC_MENUITEMS':
        return state;
    case 'ADD_PUBLIC_MENUITEM':
        return null;
    case 'RECEIVED_PUBLIC_MENUITEMS':
        return Date.now();

    default:
        return state;
    }
};

const menuItemData = combineReducers({
    menuItems,
    receivedAt,
    publicMenuItems,
    receivedPublicMenuItemsAt,
});

export default menuItemData;
