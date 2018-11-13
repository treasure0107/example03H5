<template>
    <section>
        <div>
            <img src="/static/img/loading.svg">
        </div>
    </section>
</template>
<style lang="scss" scoped>
section {
  div {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: fixed;
    img {
      height: 50px;
      width: 50px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
