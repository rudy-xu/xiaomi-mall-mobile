<template>
  <div class="app-shell app-shell-bottom-navigation">
    <mi-title title="购物车"/>
    <div class="app-view-wrapper">
      <div class="container fluid app-view app-view-with-header app-view-with-footer">
        <div class="page-wrap">
          <div v-if="!isLogin" class="nologin">
            <router-link
              class="box-flex align-center justify-space-between"
              :to="{name: 'login', query: {redirect: '/cart'}}"
            >
              <span class="flex"> 登录后享受更多优惠 </span>
              <em class="flex"> 去登录 </em>
            </router-link>
          </div>

          <div
            v-if="cartList && cartList.length"
            class="cart-list"
          >
            <ol>
              <li
                v-for="(item, index) in cartList"
                :key="item.goodsId"
                class="item"
              >
                <div class="ui-flex align-center justify-center">
                  <div class="choose flex"
                    :class="{checked: item.sel_status}"
                    @click="cartSelect(item, index)">
                    <i
                      v-if="!item.parent_goodsId"
                      class="iconfont"
                      :class="item.sel_status ? 'icon-roundcheckfill' : 'icon-round'"
                    />
                  </div>

                  <router-link
                    :to="{name: 'detail', params: { id: item.goodsId }}"
                    class="imgProduct flex"
                  >
                    <img :src="item.image_url" lazy="loaded">
                  </router-link>

                  <div class="info flex">
                    <p class="name">
                      <span class="flex">{{item.product_name}}</span>
                    </p>

                    <div
                      v-if="item.price"
                      class="price-without"
                    >
                      <span>售价：</span>
                      <span>{{item.price}} 元</span>
                      <template v-if="item.isService">
                        <span>合计：</span>
                        <span>{{item.price * item.num}} 元</span>
                      </template>
                    </div>

                    <div class="num">
                      <div class="xm-input-number">
                        <div
                          class="input-sub"
                          :class="{'active': item.num > 1 && item.price}"
                          @click="cartEdit(item, -1)"
                        >
                          <i class="iconfont icon-reduce3"></i>
                        </div>

                        <div class="input-num">
                          <span>{{item.num}}</span>
                        </div>

                        <div
                          class="input-add"
                          :class="{'active': item.num < item.buy_limit && item.price}"
                          @click="cartEdit(item, 1)"
                        >
                          <i class="iconfont icon-add"></i>
                        </div>
                      </div>
                      <div
                        v-if="item.price"
                        class="delete"
                        @click="cartDelete(item, index)"
                      >
                        <i class="iconfont icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="item.sel_status"
                  class="append flex"
                >
                  <div
                    v-for="service in item.serviceList"
                    :key="service.service_goods_id"
                    @click="toCartSelService(item)">
                    <div class="insurance">
                      <div class="i1">
                        <img :src="service.service_image_url" lazy="loaded">
                      </div>

                      <div class="i2">
                        <span> {{service.service_short_name}} {{service.service_price}}元</span>
                      </div>

                      <div class="i3">
                        <span>选购</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ol>

            <div class="point-box">
              <div class="point">
                <span class="act act_gift">赠品</span>
                <span>赠小米蓝牙耳机</span>
              </div>

              <div class="point">
                <span class="act act_special">活动</span>
                <span>下单立减100元</span>
              </div>

              <div class="point" style="display: none;">
                <span class="act act_special">包邮</span>
                <span></span>
              </div>

              <div class="point">
                <p>温馨提示：产品是否购买成功，以最终下单为准，请尽快结算</p>
              </div>
            </div>
            <!-- <div class="ui-line"></div> -->
          </div>

          <div v-else class="noitems">
            <router-link :to="{name: 'home'}" class="router-link-active">
              <span>购物车还是空的</span>
              <em>去逛逛</em>
            </router-link>
          </div>

          <MiRecommend />
        </div>

        <div class="bottom-submit box-flex">
          <div class="price-box flex">
            <span>共 {{totalNumber}} 件 金额：</span>
            <br>
            <strong>{{totalPrice}}</strong>
            <span>元</span>
          </div>

          <router-link
            :to="{name: 'category'}"
            class="btn disable black flex"
          >
            继续购物
          </router-link>

          <a class="btn flex">去结算</a>
        </div>

        <MiPop
          v-model:value="showServiceInfo"
          :close-on-click-overlay="true"
          :overlay-style="{'background-color': 'rgba(0,0,0,.4)'}"
        >
          <div class="h1">购买服务</div>

          <div class="max5">
            <div
              v-for="list in serviceInfoList"
              :key="list.type_name"
              class="border-top-1px mt2x">
              <div
                v-if="list.service_info.length"
                class="option-title pt32"
              >
                {{list.type_name}}
                <a :href="list.service_url" class="service-url">
                  <i class="iconfont icon-question"></i>
                </a>
              </div>

              <div
                v-for="service in list.service_info"
                :key="service.service_goods_id"
                class="options-group"
                @click="selectService(list, service)"
              >
                <div class="align-center justify-start layout wrap">
                  <div
                    class="option-item border-1px"
                    :class="{'on':service.sel_status}"
                  >
                    <p>{{service.service_short_name}}  {{service.service_price}}元</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-bottom align-center justify-canter layout">
            <div class="flex">{{serviceSelectMessage}}</div>
            <div class="btn" @click="serviceSelectSubmit">确定</div>
          </div>
        </MiPop>
      </div>
    </div>
  </div>
</template>

<script src="./MiCart.js"></script>

<style lang="scss" scoped src="./MiCart.scss"></style>
