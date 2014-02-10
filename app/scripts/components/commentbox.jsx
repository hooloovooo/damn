/** @jsx React.DOM */

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
        console.log(data);
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data.results;
    var newComments = comments.concat([comment]);
    this.setState({data: {results: newComments}});
    
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.loadCommentsFromServer();
      }.bind(this)
    });
    
  },
  getInitialState: function() {
    return {data: {results:[]}};
  },
  componentWillMount: function() {
    this.loadCommentsFromServer();
    this.interval = setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        <CommentList data={this.state.data.results} />
      </div>
    );
  }
});


var CommentForm = React.createClass({
  handleSubmit: function() {
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({comment: text, author_descr:get_user_name()});
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <textarea ref="text"></textarea>
        <button type="submit">Post</button>
      </form>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return <Comment key={comment.id} author={comment.author_descr} date={comment.submit_date}>{comment.comment}</Comment>;
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <div className="top clearfix">
          <h3 className="commentAuthor">
            {this.props.author}
          </h3>
          <span className="date">{this.props.date}</span>
        </div>
        <p>
          {this.props.children.toString()}
        </p>
      </div>
    );
  }
});
