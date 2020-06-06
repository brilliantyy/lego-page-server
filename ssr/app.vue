<template>
    <div id="lego-app">
        <component :is="child.name" v-for="child in children" :key="child.id"></component>
    </div>
</template>
<script>
export default {
    name: 'lego-app',
    data() {
        return {
            children: []
        }
    }
}
</script>