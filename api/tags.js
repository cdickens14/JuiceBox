const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
    next();
});

tagsRouter.get('/', async(req, res, next) => {
    try {
        const allTags = await getAllTags();
        const tags = allTags.filter(tag => {
            if (tag.active) {
                return true;
            }
            if (req.user && tag.post.id === req.post.id) {
                return true;
            }
            return false;
        });

    res.send({
        tags
    });
    } catch ({ name, message }) {
      next({ name, message});
    }
    
});

tagsRouter.get('/:tagName/posts', async(req, res, next) => {
    const { tagName } = req.params;
    try {
        const tag = await getPostsByTagName(tagName);
            res.send(
                { posts: tagName }
        );
    } catch ({ name, message }) {
      next({ name, message });
    }
});

module.exports = tagsRouter;