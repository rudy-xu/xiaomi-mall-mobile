<template>
  <div class="category_group box-flex">
    <div class="box">
      <router-link
        v-for="product in products"
        :key="product.category_id"
        class="product"
        tag="div"
        :to="{name: 'list', params: {id: product.category_id}}"
      >
        <a class="exposure item">
          <div class="img">
            <img class="big" :src="product.img_url" lazy="loaded"/>
          </div>
          <div class="name">{{product.product_name}}</div>
        </a>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.category_group {
  width: 100%;
  overflow: hidden;

  .product {
    float: left;
    width: 33.333333333333336%;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 15px;
    overflow: hidden;

    .img {
      width: 52px;
      height: 52px;
      margin: 0 auto;
      background: #f2f2f2;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
  }

  .big {
    height: 100% !important;
    width: auto !important;
  }

  .img {
    display: block;
    position: relative;
    overflow: hidden;
  }

  .name {
    margin-top: 14px;
    white-space: nowrap;
    font-size: 12px;
    color: rgba(0,0,0,.54);
  }
}

.box-flex>*, .box-inline-flex>* {
  flex: 1 1 auto;
}
</style>
