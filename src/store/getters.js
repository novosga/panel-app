
export const message = state => {
    let message = state.history[0]
    if (!message) {
        message = {
            id: 0,
            title: 'title',
            subtitle: 'subtitle',
            description: 'description',
        }
    }
    return message
}
