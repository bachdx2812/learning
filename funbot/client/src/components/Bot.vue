<template>
  <div class="fabs">
    <div class="chat" :class="chatClass">
      <div class="chat_header">
        <div class="chat_option">
        <div class="header_img">
          <img src="https://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg">
          </div>
          <span id="chat_head">Jane Doe</span> <br> <span class="agent">Agent</span> <span class="online">(Online)</span>
        </div>
      </div>
      <div id="chat_converse" class="chat_conversion chat_converse" style="display: block;">
        <span v-for="message in messages" :key="message.content" class="chat_msg_item" :class="message.isBot ? 'chat_msg_item_admin' : 'chat_msg_item_user' ">
          <div v-if="message.isBot" class="chat_avatar">
             <img src="https://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg">
          </div>
          <span v-if="message.isBot">{{ message.content }}</span>
          <span class="chat_form" v-else>
            <NameBox :questionContent="message.questionContent" v-if="isNameMessage(message)"></NameBox>
            <RadioBox :questionContent="message.questionContent" :options="message.options" v-if="isRadioMessage(message)"></RadioBox>
            <CheckBoxBox :questionContent="message.questionContent" :options="message.options" v-if="isCheckBoxMessage(message)"></CheckBoxBox>
            <JpAddressBox :questionContent="message.questionContent" :options="message.options" v-if="isJpAddressMessage(message)"></JpAddressBox>
          </span>
        </span>
        <ChatIndicator v-show="displayIndicator"></ChatIndicator>
      </div>
    </div>

    <a id="prime" class="fab is-float is-visible" @click="activateChat">
      <i class="prime zmdi" :class="iconClass"></i>
    </a>
  </div>
</template>

<script>
import axios from 'axios';

import ChatIndicator from './animations/ChatIndicator';

import NameBox from './users/NameBox.vue';
import RadioBox from './users/RadioBox.vue';
import CheckBoxBox from './users/CheckBoxBox.vue';
import JpAddressBox from './users/JpAddressBox.vue';

const STATE_INITIALIZE = 1;
const STATE_ACTIVATED = 2;

const QUESTION_TYPE_NAME = 1;
const QUESTION_TYPE_RADIO = 2;
const QUESTION_TYPE_CHECKBOX = 3;
const QUESTION_TYPE_ADDRESS = 4;

const HELLO_MESSAGE = 'Welcome Mr/Mrs';
const FINISH_MESSAGE = 'Thank you very much!';

const API_ENDPOINT = 'http://localhost:3000/';

export default {
  components: {
    NameBox,
    RadioBox,
    CheckBoxBox,
    JpAddressBox,
    ChatIndicator
  },
  data: function() {
    return {
      displayIndicator: false,
      currentState: STATE_INITIALIZE,
      iconClass: 'zmdi-comment-outline',
      chatClass: '',
      messages: [],
      botConversations: [],
      userAnwsers: [],
      finished: false
    }
  },
  created: function() {
    this.initEventListener();
  },
  methods: {
    activateChat: function() {
      this.currentState = this.isInitState ? STATE_ACTIVATED : STATE_INITIALIZE;

      if (this.currentState == STATE_ACTIVATED) {
        if (this.messages.length > 0) {
          if (this.finished) {
            this.messages = [];
            this.fetchData();
            this.finished = false;
          }
        } else {
          this.fetchData();
        }
      }
    },
    fetchData: function() {
      let self = this;

      axios.get(API_ENDPOINT)
        .then(function(response) {
          if (response.data.length > 0) {
            self.botConversations = response.data;
            self.makeMessage();
          }
        })
    },
    showIndicator: function() {
      this.displayIndicator = true;
    },
    hideIndicator: function() {
      this.displayIndicator = false;
    },
    makeMessage: function() {
      let self = this;

      if (this.botConversations.length > 0){
        this.showIndicator();

        clearTimeout();

        setTimeout(function() {
          self.hideIndicator();

          let nextBotConversion = self.botConversations.shift();

          self.messages.push({
            isBot: true,
            isQuestion: nextBotConversion.isQuestion,
            content: nextBotConversion.content
          });

          if (nextBotConversion.isQuestion) {
            self.handleUserMessage(nextBotConversion);
          } else {
            // continue to push new message
            self.makeMessage();
          };
        }, 1500)
      } else {
        self.showIndicator();
        clearTimeout();

        setTimeout(function() {
          self.hideIndicator();
          self.messages.push({
            isBot: true,
            content: FINISH_MESSAGE
          });
          self.finished = true;

          self.submitAnswersToServer();
        }, 1500);
      }
    },
    submitAnswersToServer: function() {
      console.log("aaba")
      axios.post(API_ENDPOINT, {
        data: this.userAnwsers
      }).then(function(response) {
      })
    },
    handleUserMessage: function(nextBotConversion) {
      // if this is a question, create input for user
      let newMessage = {
        isBot: false,
        type: nextBotConversion.questionType,
        questionContent: nextBotConversion.content
      }

      switch(newMessage.type) {
        case QUESTION_TYPE_RADIO:
        case QUESTION_TYPE_CHECKBOX:
          newMessage.options = nextBotConversion.options;
          break;
        case QUESTION_TYPE_ADDRESS:
          newMessage.location = nextBotConversion.location;
          break;
      }

      this.messages.push(newMessage);
    },
    isNameMessage: function(message) {
      return message.type == QUESTION_TYPE_NAME;
    },
    isRadioMessage: function(message) {
      return message.type == QUESTION_TYPE_RADIO;
    },
    isCheckBoxMessage: function(message) {
      return message.type == QUESTION_TYPE_CHECKBOX;
    },
    isJpAddressMessage: function(message) {
      return message.type == QUESTION_TYPE_ADDRESS && message.location == 'jp';
    },
    initEventListener: function() {
      this.$on('submited', function(data) {
        if(data.isName) {
          let self = this;
          self.showIndicator();

          clearTimeout();
          setTimeout(function(){
            self.messages.push({
              isBot: true,
              content: `${HELLO_MESSAGE} ${data.anwser}`
            });
            self.makeMessage();
          }, 1000);
        } else {
          this.makeMessage();
        }

        this.userAnwsers.push({
          question: data.question,
          anwser: data.anwser
        });
      });
    },
    scrollToBottom: function() {
      const chatBox = document.getElementById('chat_converse');

      chatBox.scrollBy(0, 330);
    }
  },
  computed: {
    isInitState: function() {
      return (this.currentState == STATE_INITIALIZE);
    }
  },
  watch: {
    currentState: function() {
      this.iconClass = this.isInitState ? 'zmdi-comment-outline' : 'zmdi-close is-active is-visible';
      this.chatClass = this.isInitState ? '' : 'is-visible';
    },
    messages: function() {
      this.$nextTick(function() {
        this.scrollToBottom();
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/bot.css';
</style>
