// 存储数据
export function saveToLocal(id, key, value) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		seller = {};
		seller[id] = {};
	} else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);
};
// 获取数据
export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
};

// 存储数据到cookie
export function severData(goods) {
  let carList = [];
// 先获取当前cookie
  let cookies = document.cookie.split('; ');
  for(let i=0;i<cookies.length;i++){
    let arr = cookies[i].split('=');
    if(arr[0] === 'carList'){
      carList = JSON.parse(arr[1]);
    }
  }
  let goodsObj = {};
  goodsObj.id=goods.id;
  goodsObj.name = goods.name;
  goodsObj.price = goods.price;
  goodsObj.count = goods.count;
// 如果cookie为空，则直接添加
  if(carList.length===0){
// 添加到carList
    carList.push(goodsObj);
  }
  else {
// 先判断cookie中有无相同的guid商品
    let i = 0;
    for (; i < carList.length; i++) {
// 如果商品已经存在cookie中，则数量改变成购物车中的产品数量
      if (carList[i].id=== goods.id) {
        carList[i].count++;
        break;
      }
    }
    // 如果原cookie中没有当前商品
    if (i === carList.length) {
      // 添加到carList
      carList.push(goodsObj);
    }
  }
// 存入cookie
// 把对象/数组转换诚json字符串：JSON.stringify()
  document.cookie = 'carList=' + JSON.stringify(carList);
}
// 删除数据
export function deleteData(goods) {
  let carList = [];
// 先获取当前cookie
  let cookies = document.cookie.split('; ');
  for(let i=0;i<cookies.length;i++){
    let arr = cookies[i].split('=');
    if(arr[0] === 'carList'){
      carList = JSON.parse(arr[1]);
    }
  }
// 删除cookie中对应的商品
// 根据name取对比
  for (let i = 0; i < carList.length; i++) {
// 找出要删除的商品
    if (carList[i].id === goods.id) {
      carList.splice(i, 1);
      break;
    }
  }
  document.cookie = 'carList=' + JSON.stringify(carList);
}
// 从cookie获取数据
export function loadData(data) {
  let carList = [];
// 先获取当前cookie
  let cookies = document.cookie.split('; ');
  for(let i=0;i<cookies.length;i++){
    let arr = cookies[i].split('=');
    if(arr[0] === 'carList'){
      carList = JSON.parse(arr[1]);
    }
  }
  data=carList;
   return data;
}
