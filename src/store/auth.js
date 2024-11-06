const DEFAULT_STATE = {
    auth: false,
    authToken: ""
}

export const authReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, auth: true, authToken: action.payload }
        default:
            return state;
    }
}