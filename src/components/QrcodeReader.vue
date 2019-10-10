<template>
  <section
    style="height: 100vh"
    class="bg-white"
  >
    <b-container
      class="pt-4"
    >
      <b-row>
        <b-col
          sm="12"
          lg="8"
          xl="8"
          offset-sm="0"
          offset-md="0"
          offset-lg="2"
          offset-xl="2"
          class="text-center"
        >
          <div
            class="text-center"
          >
            <b-img
              width="100px"
              rounded="0"
              fluid src="/img/qr-code.png"
              alt="Qrcode reader"
            >
            </b-img>
          </div>
          <p class="lead text-primary mt-1 mb-4">
            Qrcoder reader
          </p>
          <p class="text-danger mt-1 mb-2">
            {{ error }}
          </p>
          <b-input-group
            v-if="result"
            class="my-3"
          >
            <b-form-input class="border-primary" size="lg" v-model="result"></b-form-input>
            <b-input-group-append>
              <b-button
                variant="outline-primary"
                v-clipboard="copyUrl = result">
                <img width="30px" src="/img/copy.svg" alt="">
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <qrcode-drop-zone
            class="border drop-area border-primary"
            style="border-style: dashed !important; border-width: 3px !important;"
            v-if="!isMobile()"
            @detect="onDetect"
            @dragover="onDragOver"
            @init="logErrors"
          >
            <div
              class="bg-white py-5"
              style="opacity: 0.8"
              :class="{ 'dragover': dragover }"
            >
              <p class="text-primary font-weight-700 my-4 text-uppercase">Drag and Drop the QR Image here</p>
            </div>
          </qrcode-drop-zone>
          <qrcode-stream
            @decode="onDecode"
            @init="onInit">
          </qrcode-stream>
          <qrcode-capture
            v-if="noStreamApiSupport"
            @decode="onDecode">
          </qrcode-capture>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

  export default {
    name: "QrcodeReader",
    components: {
      QrcodeStream,
      QrcodeDropZone,
      QrcodeCapture
    },

    data () {
      return {
        copyUrl: '',
        result: '',
        error: '',
        dragover: false,
        noStreamApiSupport: false
      }
    },

    methods: {

      onDecode (result) {
        this.result = result
      },

      isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      },

      logErrors (promise) {
        promise.catch()
      },

      onDragOver (isDraggingOver) {
        this.dragover = isDraggingOver
      },

      async onDetect (promise) {
        try {
          const { content } = await promise
          this.result = content
          this.error = null
        } catch (error) {
          if (error.name === 'DropImageFetchError') {
            this.error = 'Sorry, you can\'t load cross-origin images :/'
          } else if (error.name === 'DropImageDecodeError') {
            this.error = 'Ok, that\'s not an image. That can\'t be decoded.'
          } else {
            this.error = 'Ups, what kind of error is this?! ' + error.message
          }
        }
      },

      async onInit (promise) {
        try {
          await promise
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            this.error = "ERROR: you need to grant camera access permisson"
          } else if (error.name === 'NotFoundError') {
            if (this.isMobile()){
              this.error = "ERROR: no camera on this device"
            }
          } else if (error.name === 'NotSupportedError') {
            this.error = "ERROR: secure context required (HTTPS, localhost)"
          } else if (error.name === 'NotReadableError') {
            this.error = "ERROR: is the camera already in use?"
          } else if (error.name === 'OverconstrainedError') {
            this.error = "ERROR: installed cameras are not suitable"
          } else if (error.name === 'StreamApiNotSupportedError') {
            this.error = "ERROR: Stream API is not supported in this browser"
            this.noStreamApiSupport = true
          }
        }
      }

    }
  }
</script>

<style>
  .drop-area:hover {
    opacity: 0.6;
  }
</style>