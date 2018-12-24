import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { Subject, of, from } from 'rxjs';
import { pairwise, filter, exhaustMap } from 'rxjs/operators';
import { Scrollbars } from 'react-custom-scrollbars';

import Message from './Message';

import { onCreateMessage } from 'graphql/subscriptions';

const SCROLL_THRESHOLD = 0.25;

class MessagePane extends Component {
  scrollbarsRef = React.createRef();
  subject = new Subject();
  obs = this.subject.asObservable();

  componentDidMount() {
    console.log('MessagePane - componentDidMount');
    if (this.props.channel) {
      console.log('MessagePane - componentDidMount - subscribe');
      this.unsubscribe = this.createSubForConversationMsgs();
    }
    this.obs
      .pipe(
        pairwise(),
        filter(this.isScrollingUpPastThreshold),
        exhaustMap(this.loadMoreMessages)
      )
      .subscribe(_ => {});
  }

  componentDidUpdate(prevProps, prevState) {
    if ( !this.props.channel ) {
      return;
    }
    let curConv = {}, prevConvo = {};
    curConv = this.props.channel.conversation || {};
    if ( prevProps.channel ) {
      prevConvo = prevProps.channel.conversation || {};
    }
    if (curConv && prevConvo.id !== curConv.id) {
      if (this.unsubscribe) {
        console.log('MessagePane - componentDidUpdate - unsubscribe');
        this.unsubscribe();
      }
      console.log('MessagePane - componentDidUpdate - subscribe');
      this.unsubscribe = this.createSubForConversationMsgs();
    }
    const prevMsgs = prevProps.messages || [];
    const messages = this.props.messages || [];
    if (prevMsgs.length !== messages.length) {
      const p0 = prevMsgs[0];
      const m0 = messages[0];
      if ((p0 && m0 && p0.id !== m0.id) || (!p0 && m0)) {
        this.scrollbarsRef.current.scrollToBottom();
      }
    }
  }

  componentWillUnmount() {
    console.log('MessagePane - componentWillUnmount');
    if (this.unsubscribe) {
      console.log('MessagePane - componentDidUpdate - unsubscribe');
      this.unsubscribe();
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  //   this.obs
  //     .pipe(
  //       pairwise(),
  //       filter(this.isScrollingUpPastThreshold),
  //       exhaustMap(this.loadMoreMessages)
  //     )
  //     .subscribe(_ => {});
  // }

  isScrollingUpPastThreshold = ([prev, curr]) => {
    // console.log('isScrolling', prev, curr)
    const result = (prev.top > curr.top) & (curr.top < SCROLL_THRESHOLD);
    if (result) {
      console.log('Should fetch more messages');
    }
    return result;
  }

  loadMoreMessages = () => {
    const { fetchMore, nextToken } = this.props;
    if (!nextToken) {
      return of(true);
    }
    const result = fetchMore({
      variables: { nextToken: nextToken },
      updateQuery: (prev, { fetchMoreResult: data }) => {
        const update = {
          getConversation: {
            ...prev.getConversation,
            messages: {
              ...prev.getConversation.messages,
              nextToken: data.getConversation.messages.nextToken,
              items: [
                ...prev.getConversation.messages.items,
                ...data.getConversation.messages.items
              ]
            }
          }
        };
        return update;
      }
    });
    return from(result);
  }

  createSubForConversationMsgs = () => { 
    const {
      subscribeToMore,
      channel: { conversation: { id: conversationId } },
      userId
    } = this.props;
    console.log('createSubForConversationMsgs', conversationId);

    return subscribeToMore({
      document: onCreateMessage,
      variables: { messageConversationId: conversationId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { onCreateMessage: newMsg }
          }
        }
      ) => {
        console.log('updateQuery on message subscription', prev, newMsg);
        if (newMsg.owner === userId) {
          console.log('skipping own message');
          return;
        }

        const current = {
          getConversation: {
            ...prev.getConversation,
            messages: {
              ...prev.getConversation.messages,
              items: [newMsg, ...prev.getConversation.messages.items]
            }
          }
        };
        return current;
      }
    });
  }

  render() {
    const { messages, channel, userId, userMap } = this.props;

    return(
      <Form className='message-pane'>
        {
          channel && (
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              onScrollFrame={values => this.subject.next(values)}
              ref={this.scrollbarsRef}
            >
              <div className='message-list d-flex flex-column'>
                {[...messages].reverse().map((msg, idx, arr) => 
                  <Message
                    key={msg.id}
                    username={userMap[msg.owner]}
                    message={msg.content}
                    createdAt={msg.createdAt}
                    isUser={msg.owner === userId}
                  />
                )}
              </div>
            </Scrollbars>
          )
        }
      </Form>
    );
  }
}

MessagePane.propTypes = {
  userId: PropTypes.string,
  channel: PropTypes.object,
  userMap: PropTypes.object,
  messages: PropTypes.array.isRequired,
  subscribeToMore: PropTypes.func,
  fetchMore: PropTypes.func,
  nextToken: PropTypes.string
};

export default MessagePane;