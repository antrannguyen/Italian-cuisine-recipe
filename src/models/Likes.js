export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, autor, img) {
        const like = { id, title, autor, img };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData()
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData()

    }

    isLiked(id) {
        return (this.likes.findIndex(el => el.id === id)) !== -1;
    }

    getNumberLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'))

        //Restore likes from the localStorage
        if (storage) this.likes = storage;
    }
}