import React from 'react';
import PropTypes from 'prop-types';

import Stream from './Stream';
import Suspender from './common/suspend/Suspender';

const demoPosts = [
  {
    id: '0',
    author: {
      id: '5aa49b55-bc42-4fb6-af91-495a52403883',
      displayName: 'Author 1',
    },
    contentType: 'text/plain',
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 0,
  },
  {
    id: '1',
    author: {
      id: 'author2@example.net',
      displayName: 'Author 2',
    },
    contentType: 'text/markdown',
    content: 'So what I think is going on here is actually **nothing in particular**.\n\nIt\'s all in how you [look at it](http://localhost:8000), after all.\n\nHTML shouldn\'t be interpreted, so these should just render as plain text: <pre>\ntest\n</pre> <a href="http://localhost:8000">test</a>',
    commentCount: 13,
  },
  {
    id: '2',
    author: {
      id: 'author3@example.net',
      displayName: 'Author 3',
    },
    content: 'Post 3',
    commentCount: 1,
  },
  {
    id: '3',
    author: {
      id: 'author4@example.net',
      displayName: 'Author 4',
    },
    content: 'Post 4',
    commentCount: 0,
  },
  {
    id: '4',
    author: {
      id: 'author5@example.net',
      displayName: 'Author 5',
    },
    content: 'Post 5',
    commentCount: 0,
  },
  {
    id: '5',
    author: {
      id: 'author1@example.net',
      displayName: 'Author 1',
    },
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 5,
  },
  {
    id: '6',
    author: {
      id: 'author2@example.net',
      displayName: 'Author 2',
    },
    content: 'So what I think is going on here is actually nothing in particular. This post, by the way, has an ID of 6, but it\'s actually the seventh post on the page, because that\'s how indexing works.',
    commentCount: 0,
  },
  {
    id: '7',
    author: {
      id: 'author1@example.net',
      displayName: 'Author 1',
    },
    content: 'In the end, it didn\'t work, but we discovered several things along the way: first, that whatever you do, you can\'t do anything you thought you maybe couldn\'t do unless you at least tell yourself you can try; second, that whatever you wanted to do, it may or may not already have been done; and third, that writing example text is actually kind of difficult.',
    commentCount: 1012,
  },
];

export default class StreamLoader extends React.Component {
  state = {
    posts: [],
    pending: true,
  };

  constructor(props) {
    super(props);

    this.doLoadMore = this.doLoadMore.bind(this);
  }

  componentDidMount() {
    this.doLoadMore().then(
      () => { this.setState({ pending: false }); },
    );
  }

  doLoadMore() {
    // TODO loader placeholder
    return new Promise(
      (resolve) => {
        window.setTimeout(
          () => {
            const posts = demoPosts;
            const { posts: currentPosts } = this.state;
            this.setState({
              posts: currentPosts.concat(posts),
            });
            resolve();
          },
          1000,
        );
      },
    );
  }

  render() {
    const { PostComponent } = this.props;
    const { posts, pending } = this.state;

    return (
      pending
        ? <div className="stream-placeholder"><Suspender /></div>
        : (
          <Stream
            PostComponent={PostComponent}
            posts={posts}
            hasMore
            loadMoreCallback={this.doLoadMore}
          />
        )
    );
  }
}

StreamLoader.propTypes = {
  PostComponent: PropTypes.elementType.isRequired,
};
