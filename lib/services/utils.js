export function dumpPosts(posts) {
    return {
        id       : posts._id,
        username : posts.username,
        text     : posts.text
    };
}
