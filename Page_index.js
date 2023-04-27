let data; //API讀取的資料
let PageIndex; //目前頁數

function GetPageData() {
    // 取得顯示頁面及頁數
    GetActivePage();
    
    if(data == null) return;
    let PageNum = Math.ceil(data.length / PageSize);  //計算總頁數
    if (PageNum == 0) {
        $("#products-datatable_info").hide();  
        $("#products-datatable_paginate").hide(); 
    }
    else {
        $("#products-datatable_info").show();  
        $("#products-datatable_paginate").show(); 
        $(`#${main_tbody}-products-datatable_info`).html('顯示第' + (PageIndex + 1) + '頁，共' + PageNum + '頁');
        let page = "";
        //上一頁按鈕
        if (PageIndex == 0) { 
            page = `<li class="paginate_button page-item previous disabled" id="products-datatable_previous">
                    <a href="#" aria-controls="products-datatable" data-dt-idx="0" tabindex="0" class="page-link">
                        <i class="mdi mdi-chevron-left"></i></a></li>`;
        }
        else {
            page = `<li class="paginate_button page-item previous" id="products-datatable_previous">
                    <a href="javascript:void(0)" onclick="PageIndex = ${PageIndex - 1}; ClickPage();" aria-controls="products-datatable" data-dt-idx="0" tabindex="0" class="page-link">
                        <i class="mdi mdi-chevron-left"></i></a></li>`;
        }
        //包含目前頁數在內的十頁按鈕
        for (let i = Math.floor(PageIndex / 10) * 10; i < Math.ceil((PageIndex + 1) / 10) * 10 && i < PageNum; i++) {
            if (i == PageIndex)
                page += `<li class="paginate_button page-item active">
                        <a href="javascript:void(0)" onclick="PageIndex = ${i}; ClickPage()" aria-controls="products-datatable" data-dt-idx="0" tabindex="1" class="page-link">${i + 1}</a>
                    </li>`;
            else
                page += `<li class="paginate_button page-item">
                        <a href="javascript:void(0)" onclick="PageIndex = ${i}; ClickPage()" aria-controls="products-datatable" data-dt-idx="0" tabindex="2" class="page-link">${i + 1}</a>
                    </li>`;
        }
        //下一頁按鈕
        if (PageIndex == PageNum - 1) {
            page += `<li class="paginate_button page-item next disabled" id="products-datatable_next">
                    <a href="javascript:void(0)" aria-controls="products-datatable" data-dt-idx="3" tabindex="0" class="page-link">
                        <i class="mdi mdi-chevron-right"></i></a></li>`;
        }
        else {
            page += `<li class="paginate_button page-item next" id="products-datatable_next">
                    <a href="javascript:void(0)" onclick="PageIndex = ${PageIndex + 1}; ClickPage();" aria-controls="products-datatable" data-dt-idx="3" tabindex="0" class="page-link">
                        <i class="mdi mdi-chevron-right"></i></a></li>`;
        }
        $('.pagination.pagination-rounded').html(page);

        var pageData = data.slice(PageIndex * PageSize, ((PageIndex + 1) * PageSize)); 
        $("tbody#"+main_tbody).html(pageData.map(model_to_tr)); //產生資料tr,model_to_tr是產生tr的Function
    }
}

function ClickPage() {
    var Now = Date.now();
    //判斷經過一定時間需重新抓取資料
    if (Now - ReloadTime > 600000) //需宣告一個全域變數 ReloadTime ,讀取API後,呼叫成功,需執行ReloadTime=Date.now();
        GetCategoryInfo(); //您讀取資料API的function
    else
        GetPageData();
}
