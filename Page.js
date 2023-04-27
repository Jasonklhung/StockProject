function addScript(){
    document.write("<script language=javascript src='Page_index.js'></script>");
}
// 引入 Page_index.js
addScript();

// 計算重新取得時間
var ReloadTime;
// 取得顯示tbody
let main_tbody = '';
let PageSize = 5;
// 暫存四個tab搜尋選項
var postParamList = {"tab1_param" : {},"tab2_param" : {},"tab3_param" : {},"tab4_param" : {}};

function _uuid()
{
    let d=Date.now();
    if(typeof performance!=='undefined'&&typeof performance.now==='function')
        d+=performance.now(); // use high-precision timer if available
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c)
    {
        let r=(d+Math.random()*16)%16|0;
        d=Math.floor(d/16);
        return (c==='x'?r:(r&0x3|0x8)).toString(16);
    });
}

$("body").on("click",".myarrow",function(e){
	let selector=$(this).attr("for");
	// 處理子specList 展開/合併
	var displayControl = document.querySelectorAll(`[id^="${selector.substring(1)}_child"]`);
	displayControl.forEach(tr => {
		if(tr.style.display == 'none')
			tr.style.display = 'table-row';
		else
			tr.style.display = 'none';
	});

	if($(this).css("transform")==="matrix(0, 1, -1, 0, 0, 0)")
	{
		$(selector).addClass("d-none");
		$(this).css("transform","");
	}
	else
	{
		$(selector).removeClass("d-none");
		$(this).css("transform","rotate(90deg)");
	}
});


$(document).ready(function(){
	GetUnlistedGoods();
});

$('a[href="#home-b1"]').on('click', function() {
	GetUnlistedGoods();
});

$('a[href="#profile-b1"]').on('click', function() {
	GetShelvedGoods();
});

$('a[href="#messages-b1"]').on('click', function() {
	GetEndGoods();
});

$('a[href="#tab4"]').on('click', function() {
	GetIllegalGoods();
});

// 載入 API 1
function GetUnlistedGoods(name, specNo) {
	let postParam = {"Name":name,"SpecNo":specNo};
	postParamList["tab1_param"] = postParam;
	url = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/GetUnlistedGoods";

	ReloadTime = Date.now();

	$.ajax({
        url: url,
        type: "POST",
		data: JSON.stringify(postParam),
        dataType: "json",
        success: function(dataFromApi) {
            if(dataFromApi.state == 'ok'){
				if(dataFromApi.result.length > 0)
					data = Array.from(dataFromApi.result);
				else{
					$("div#home-b1 ul.pagination.pagination-rounded").remove();
					data = null;
				}
				//預設第一頁
				PageIndex = 0;
				ClickPage();
				return;
			}
			$("div#home-b1 ul.pagination.pagination-rounded").remove();
        }
    });
}

// 載入 API 4
function GetShelvedGoods(name, specNo){
	let postParam = {"Name":name,"SpecNo":specNo};
	postParamList["tab2_param"] = postParam;
	url = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/GetShelvedGoods";

	ReloadTime = Date.now();

	$.ajax({
        url: url,
        type: "POST",
		data: JSON.stringify(postParam),
        dataType: "json",
        success: function(dataFromApi) {
            if(dataFromApi.state == 'ok'){
				if(dataFromApi.result.length > 0)
					data = Array.from(dataFromApi.result);
				else{
					$("div#profile-b1 ul.pagination.pagination-rounded").remove();
					data = null;
				}

				//預設第一頁
				PageIndex = 0;
				ClickPage();
				return;
			}
			$("div#profile-b1 ul.pagination.pagination-rounded").remove();
        }
    });

}

// 載入 API 6
function GetEndGoods(name, specNo) {
	let postParam = {"Name":name,"SpecNo":specNo};
	postParamList["tab3_param"] = postParam;
	url = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/GetEndGoods";

	ReloadTime = Date.now();

	$.ajax({
        url: url,
        type: "POST",
		data: JSON.stringify(postParam),
        dataType: "json",
        success: function(dataFromApi) {
            if(dataFromApi.state == 'ok'){
				if(dataFromApi.result.length > 0)
					data = Array.from(dataFromApi.result);
				else{
					$("div#messages-b1 ul.pagination.pagination-rounded").remove();
					data = null;
				}

				//預設第一頁
				PageIndex = 0;
				ClickPage();
				return;
			}
			$("div#messages-b1 ul.pagination.pagination-rounded").remove();
        }
    });
}

// 載入 API 7
function GetIllegalGoods(name, specNo){
	let postParam = {"Name":name,"SpecNo":specNo};
	postParamList["tab4_param"] = postParam;
	url = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/GetIllegalGoods";

	ReloadTime = Date.now();

	$.ajax({
        url: url,
        type: "POST",
		data: JSON.stringify(postParam),
        dataType: "json",
        success: function(dataFromApi) {
            if(dataFromApi.state == 'ok'){
				if(dataFromApi.result.length > 0)
					data = Array.from(dataFromApi.result);
				else{
					$("div#tab4 ul.pagination.pagination-rounded").remove();
					data = null;
				}

				//預設第一頁
				PageIndex = 0;
				ClickPage();
				return;
			}
			$("div#tab4 ul.pagination.pagination-rounded").remove();
        }
    });
}

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

$("th input").on("change",function(e){
	let parent=$(this).closest("table").find("tbody");
	$(parent).find("input[type='checkbox']").prop("checked",this.checked);
})

function model_to_tr(modal){
	let id=_uuid();
	if(main_tbody == 'tab1_tbody'){
		return model_to_tr_GetUnlistedGoods(modal, id);
	}else if(main_tbody == 'tab2_tbody'){
		return model_to_tr_ShelvedGoods(modal, id);
	}else if(main_tbody == 'tab3_tbody'){
		return model_to_tr_GetEndGoods(modal, id);
	}else if(main_tbody == 'tab4_tbody'){
		return model_to_tr_GetIllegalGoods(modal);
	}x
}

function model_to_tr_GetUnlistedGoods(modal, id){
	let temp = '';
	let specMoreListContent = '';
	let specListCount = 0;
	let specMoreListCount = 0;
	$.each(modal.SpecList,function(j,specList) {
		specMoreListContent = '';
		specMoreListCount = 0;
		$.each(specList.SpecMoreList,function(k,specMoreList) {
			if(specMoreListContent == ''){
				specMoreListContent += `${specMoreList.Name + ','+ specMoreList.Content}`;
			}else{
				specMoreListContent += `<br/>${specMoreList.Name + ','+ specMoreList.Content}`;
			}
			specMoreListCount++;
		});

		temp += model_get_temp(id, modal, specMoreListContent, specList, specListCount, specMoreListCount);
		specListCount++;
	});
	return temp;
}

function model_get_temp(id, modal, specMoreListContent, specList, specListCount, specMoreListCount){
	let a = specMoreListCount > 1 ?`<div class="d-flex align-items-center">
															<span class="menu-arrow myarrow" style="right: auto; cursor: pointer;" for=".${id}">我是按鈕</span>
														</div>` : "";
	let temp = specListCount < 1 ? `<tr>
			<td>
				${a}
			</td>
			<td>
				<div class="form-check form-check-inline">
					<input class="form-check-input mt-2" type="checkbox" name="check">
				</div>
			</td>
			<td><img src="${modal.GoodsImageList[0].Url}" alt=""></td>` :
			`<tr id="${id}_child">
				<td/>
				<td/>
				<td/>
			`;
	temp += `
			<td>${modal.Name}</td>
			<td>${$.trim(specList.SpecNo) == '' ? '-': $.trim(specList.SpecNo)}</td>
			<td>${specMoreListContent == '' ? '-': specMoreListContent}</td>
			<td>${specList.DiscountPrice != 0 ? '<del>'+specList.Price+'</del> ' + specList.DiscountPrice : specList.Price}</td>
			<td>${specList.PreparedAmount}</td>	
			<td>${specList.Amount - specList.PreparedAmount}</td>	
			<td>
				<div class="dropdown">
					<button class="dropdown-toggle dotsMore" type="button" data-bs-toggle="dropdown" aria-expanded="false" onclick="PostEndGoods(${modal.GoodID})">
						<i class="fe-more-horizontal-"></i>
					</button>
					<div class="dropdown-menu" style="">
						<a class="dropdown-item" href="#">選項文字1</a>
						<a class="dropdown-item" href="#">選項文字2</a>
						<a class="dropdown-item" href="#">選項文字3</a>
						<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#model-1">選項文字4</a>
						<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modal-3">選項文字5</a>
					</div>
				</div>
			</td>
		</tr>`;
	return temp;
}



// 將API4物件陣列轉為<tr>
function model_to_tr_ShelvedGoods(modal, id){
	let temp = '';
	let specMoreListContent = '';
	let specListCount = 0;
	let specMoreListCount = 0;
	$.each(modal.SpecList,function(j,specList) {
		specMoreListContent = '';
		specMoreListCount = 0;
		$.each(specList.SpecMoreList,function(k,specMoreList) {
			if(specMoreListContent == ''){
				specMoreListContent += `${specMoreList.Name + ','+ specMoreList.Content}`;
			}else{
				specMoreListContent += `<br/>${specMoreList.Name + ','+ specMoreList.Content}`;
			}
			specMoreListCount++;
		});

		temp += model_get_temp(id, modal, specMoreListContent, specList, specListCount, specMoreListCount);
		specListCount++;
});
	return temp;
}

// 將API6物件陣列轉為<tr>
function model_to_tr_GetEndGoods(modal, id){
	let temp = '';
	let specMoreListContent = '';
	let specListCount = 0;
	let specMoreListCount = 0;
	$.each(modal.SpecList,function(j,specList) {
		specMoreListContent = '';
		specMoreListCount = 0;
		$.each(specList.SpecMoreList,function(k,specMoreList) {
			if(specMoreListContent == ''){
				specMoreListContent += `${specMoreList.Name + ','+ specMoreList.Content}`;
			}else{
				specMoreListContent += `<br/>${specMoreList.Name + ','+ specMoreList.Content}`;
			}
			specMoreListCount++;
		});

		temp += model_get_temp(id, modal, specMoreListContent, specList, specListCount, specMoreListCount);
		specListCount++;
		});
	return temp;
}

// 將API7物件陣列轉為<tr>
function model_to_tr_GetIllegalGoods(modal){
	let temp = `<tr>
			<td><img src="${modal.GoodsImageList[0].Url}" alt=""></td>
			<td>${modal.Name}</td>
			<td class="txt-over">
				<article id="popover-container">
					<p class="multiline-ellipsis">
						${modal.IllegalDescription}
					</p>
					<button type="button" class="btn morebtn">
						<div class="button-list float-end" id="tooltip-container">
							<a class="text-body dropdown-toggle"
								data-bs-container="#popover-container"
								data-bs-toggle="popover" data-bs-placement="right"
								data-bs-content="${modal.IllegalDescription}"
								data-original-title="">
								<p class="openBtn">更多</p>
							</a>
						</div>
					</button>
				</article>
			</td>
			<td class="txt-over">
				<article id="popover-container">
					<p class="multiline-ellipsis">
						${modal.IllegalDescription}
					</p>
					<button type="button" class="btn morebtn">
						<div class="button-list float-end" id="tooltip-container">
							<a class="text-body dropdown-toggle"
								data-bs-container="#popover-container"
								data-bs-toggle="popover" data-bs-placement="right"
								data-bs-content="${modal.IllegalDescription}"
								data-original-title="">
								<p class="openBtn">更多</p>
							</a>
						</div>
					</button>
				</article>
			</td>
			<td>${modal.EndDate.split('T')[0].replace('-','/')}</td>
			<td class="control">
				<span data-bs-toggle="modal" data-bs-target="#createModal" style="cursor: pointer;">
					<i class="far fa-edit"></i>
				</span>
				<span data-bs-toggle="modal" data-bs-target="#model-1" style="cursor: pointer;">
					<i class="far fa-trash-alt"></i>
				</span>
			</td>
		</tr>`;
	return temp;

}
// 設定當前顯示的tab以及每頁幾筆
function GetActivePage(){
	if(window.getComputedStyle(document.getElementById("home-b1")).display == 'block'){
		PageSize = $('#home-b1-select').val();
		main_tbody = 'tab1_tbody';
	}else if(window.getComputedStyle(document.getElementById("profile-b1")).display == 'block'){
		PageSize = $('#profile-b1-select').val();
		main_tbody = 'tab2_tbody';
	}else if(window.getComputedStyle(document.getElementById("messages-b1")).display == 'block'){
		PageSize = $('#messages-b1-select').val();
		main_tbody = 'tab3_tbody';
	}else if(window.getComputedStyle(document.getElementById("tab4")).display == 'block'){
		PageSize = $('#tab4-select').val();
		main_tbody = 'tab4_tbody';
	}
}
// 依照當前Tab 以及暫存文字輸入 執行查詢
function GetCategoryInfo(){
	if(main_tbody == 'tab1_tbody'){
		GetUnlistedGoods(postParamList["tab1_param"]["Name"],postParamList["tab1_param"]["SpecNo"]);
	}else if(main_tbody == 'tab2_tbody'){
		GetShelvedGoods(postParamList["tab2_param"]["Name"],postParamList["tab2_param"]["SpecNo"]);
	}else if(main_tbody == 'tab3_tbody'){
		GetEndGoods(postParamList["tab3_param"]["Name"],postParamList["tab3_param"]["SpecNo"]);
	}else if(main_tbody == 'tab4_tbody'){
		GetIllegalGoods(postParamList["tab4_param"]["Name"],postParamList["tab4_param"]["SpecNo"]);
	}
}

// API 2 儲存資料
function PostEndGoods (goodid){

	var let = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/EndGoods";

	$("#dialogSubmit").on("click",function(){

		var getSelectedRadio = $("input[name='flexRadioDefault']:checked")
		var reason = getSelectedRadio.next("label").text().trim();
		if(reason == ""){
			var otherInput = getSelectedRadio.next("div").find("#other");
			var reason = otherInput.val()
		}

		var data = {
			"GoodId": [goodid],
			"Reason": reason
		};

		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(response) {
				if(response.Stake == "ok"){
					alert("儲存成功")
				}
				else if(response.Stake == "fail"){
					alert("儲存失敗")
				}
				else if(response.Stake == "no user"){
					alert("帳號已登出或帳號尚未登入");
					window.location.href = response.url;
				}
			}
		});
	})
}

function BatchRemoval(){

	let url = "https://testapi.ladraw.com:21016/Services/GoodsService.asmx/EndGoods";
	let goodId = [];
	let reason = "";

	$("input[name='check']:checked").each(function() {
		var getGoodId = parseInt($(this).closest("tr").find("td:eq(4)").text());
		goodId.push(getGoodId)
	});

	var data = {
		"GoodId": goodId,
		"Reason": reason
	};

	$.ajax({
		type: "POST",
		url: url,
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(response) {
			if(response.Stake == "ok"){
				alert("儲存成功")
			}
			else if(response.Stake == "fail"){
				alert("儲存失敗")
			}
			else if(response.Stake == "no user"){
				alert("帳號已登出或帳號尚未登入");
				window.location.href = response.url;
			}
		}
	});
}
