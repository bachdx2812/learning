<template>
  <div class="message_form">
    <label>郵便番号</label>
    <div class="postal-code">
      <input type="text" class="begin" v-model="beginPostalCode" maxlength="3"/>
      <input type="text" class="end" v-model="endPostalCode" maxlength="4"/>
    </div>

    <label>都道府県名</label>
    <input type="text" v-model="prefecture"/>

    <label>市区町村名</label>
    <input type="text" v-model="area"/>

    <label>番地・マンション名</label>
    <input type="text" v-model="detailAddress"/>

    <button @click="submit" :disabled="done">Submit</button>
  </div>
</template>

<script>
let postalCode = require('japan-postal-code');

export default {
  props: {
    questionContent: {
      type: String,
      required: false
    }
  },
  data: function() {
    return {
      beginPostalCode: '',
      endPostalCode: '',
      prefecture: '',
      area: '',
      detailAddress: '',
      done: false
    }
  },
  computed: {
    fullPostalCode: function(){
      if (this.beginPostalCode == '' || this.endPostalCode == '') {
        return '';
      }

      return `${this.beginPostalCode}${this.endPostalCode}`;
    }
  },
  watch: {
    fullPostalCode: function(val) {
      if (val) {
        let self = this;
        postalCode.get(val, function(address) {
          if (address) {
            self.prefecture = address.prefecture;
            self.area = `${address.city}${address.area}${address.street}`;
          }
        })
      }
    }
  },
  methods: {
    submit: function() {
      if (this.done) {
        return false;
      }
      this.$parent.$emit('submited', {
        question: this.questionContent,
        anwser: {
          fullPostalCode: this.fullPostalCode,
          prefecture: this.prefecture,
          area: this.area,
          detailAddress: this.detailAddress
        }
      });
      this.done = true;
    }
  }
}
</script>

<style scoped>
.message_form {
  display: flex;
  flex-direction: column;
  font-size: 15px;
}

.postal-code {
  display: flex;
  flex-direction: row;
  width: 97%;
}

.postal-code .begin {
  flex: 1;
  margin-right: 5px;
  width: 100% !important;
}

.postal-code .end {
  flex: 2;
  width: 100% !important;
}
</style>
