// import {Category} from "./categories.js";
// let category = new Category()
export class Ui {
  constructor() {
    this.listWidth = $(".nav-body").innerWidth();
    this.category;
    this.menuBtn = $(".nav-header>i");
    this.itemsList = $(".list-unstyled");
    this.items = $(".list-unstyled li");
    this.meals;
    this.meal;
    this.area;
    this.ang;
    this.fInput = $("#name");
    this.sInput = $("#firstLetter");
    this.showMenu();
    this.categoriesData();
    this.showSearch();
    this.mealDetails();
    this.randomMeals();
    this.areaList();
    this.angList();
    this.contact();
  }
  async randomMeals() {
    this.loading("#rowdata");
    let element = ``;
    let responseArr = [];
    for (let index = 0; index < 16; index++) {
      let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/random.php`
      );
      responseArr.push(await response.json());
    }
    for (let i = 0; i < responseArr.length; i++) {
      for (let j = 0; j < responseArr[i].meals.length; j++) {
        element += `
                <div class="col-md-3">
                    <div id="${responseArr[i].meals[j].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src="${responseArr[i].meals[j].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${responseArr[i].meals[j].strMeal}</h3>
                        </div>
                    </div>
                </div>`;
      }
    }
    $("#rowdata").html(element);
  }

  searchData(name) {
    let mealContainer = ``;
    for (let index = 0; index < name.meals.length; index++) {
      mealContainer += `
    <div class="col-md-3">
        <div id="${name.meals[index].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${name.meals[index].strMealThumb}" alt="" srcset="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${name.meals[index].strMeal}</h3>
            </div>
        </div>
    </div>`;
    }
    $("#searchdata").html(mealContainer);
  }
  showSearch() {
    this.itemsList.children(":first").click(async () => {
      $(".side-menu").animate({ left: `${-this.listWidth}` }, 500);
      $(this.menuBtn).removeClass("fa-x").addClass("fa-align-justify");
      $(".list-unstyled li").animate({ top: "200px" }, "slow");
      $("#rowdata").css("display", "none");
      $("#searchContainer").css("display", "block");
      $("body").css("overflow", "hidden");
      $(this.fInput).keyup(async () => {
        console.log($(this.fInput).val());
        let name = await this.nameSearchFetch($(this.fInput).val());
        console.log(name);
        this.searchData(name);
      });
      $(this.sInput).keyup(async () => {
        console.log($(this.sInput).val());
        let letter = await this.letterSearchFetch($(this.sInput).val());
        this.searchData(letter);
      });
    });
  }
  areaList() {
    this.itemsList
      .children(":first")
      .next()
      .next()
      .click(async () => {
        $(".side-menu").animate({ left: `${-this.listWidth}` }, 500);
        $(this.menuBtn).removeClass("fa-x").addClass("fa-align-justify");
        $(".list-unstyled li").animate({ top: "200px" }, "slow");
        $("#searchContainer").css("display", "none");
        $("#rowdata").css("display", "flex");
        $("body").css("overflow", "auto");
        this.area = await this.areaFetch();
        let areaArr = this.area.meals;
        let areaContainer = ``;
        for (let index = 0; index < areaArr.length; index++) {
          areaContainer += `<div class="col-md-3">
            <div id="${areaArr[index].strArea}" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x cursor-pointer"></i>
                    <h3 class="cursor-pointer">${areaArr[index].strArea}</h3>
            </div>
        </div>`;
        }
        $("#rowdata").html(areaContainer);
        $("#rowdata").click(async (e) => {
          let location = $(e.target).parents().attr("id");
          let areaMeals = await this.areaMealsFetch(location);
          this.showMeal(areaMeals);
        });
      });
  }
  angList() {
    this.itemsList
      .children(":first")
      .next()
      .next()
      .next()
      .click(async () => {
        $(".side-menu").animate({ left: `${-this.listWidth}` }, 500);
        $(this.menuBtn).removeClass("fa-x").addClass("fa-align-justify");
        $(".list-unstyled li").animate({ top: "200px" }, "slow");
        $("#searchContainer").css("display", "none");
        $("#rowdata").css("display", "flex");
        $("body").css("overflow", "auto");
        this.ang = await this.angFetch();
        let angArr = this.ang.meals;
        let angContainer = ``;
        for (let index = 0; index < 24; index++) {
          angContainer += `<div class="col-md-3">
            <div id="${angArr[index].strIngredient}" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x cursor-pointer"></i>
                    <h3 class="cursor-pointer">${angArr[index].strIngredient}</h3>
                    <p>${angArr[index].strDescription}</p>
            </div>
        </div>`;
        }
        $("#rowdata").html(angContainer);
        $("#rowdata").click(async (e) => {
          let ingredient = $(e.target).parents().attr("id");
          console.log(e.target);
          let angMeals = await this.angMealsFetch(ingredient);
          this.showMeal(angMeals);
        });
      });
  }
  showMenu() {
    this.menuBtn.click(function () {
      let listWidth = $(".nav-body").innerWidth();
      let left = $(".side-menu").css("left");
      if (left != "0px") {
        $(".side-menu").animate({ left: "0px" }, 500);
        $(this).removeClass("fa-align-justify").addClass("fa-x");
        $(".list-unstyled li").animate({ top: "0" }, 500);
      } else {
        $(".side-menu").animate({ left: `${-listWidth}` }, 500);
        $(this).removeClass("fa-x").addClass("fa-align-justify");
        $(".list-unstyled li").animate({ top: "200px" }, "slow");
      }
    });
  }

  categoriesData() {
    this.itemsList
      .children(":first")
      .next()
      .click(async () => {
        $(".side-menu").animate({ left: `${-this.listWidth}` }, 500);
        $(this.menuBtn).removeClass("fa-x").addClass("fa-align-justify");
        $(".list-unstyled li").animate({ top: "200px" }, "slow");
        $("#searchContainer").css("display", "none");
        $("#rowdata").css("display", "flex");
        $("body").css("overflow", "auto");
        this.category = await this.categoriesFetch();
        let categoryArr = this.category.categories;
        let catContainer = ``;
        for (let index = 0; index < categoryArr.length; index++) {
          catContainer += `<div class="col-md-3">
            <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${categoryArr[index].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${categoryArr[index].strCategory}</h3>
                    <p>${categoryArr[index].strCategoryDescription}</p>
                </div>
            </div>
        </div>`;
        }
        $("#rowdata").html(catContainer);
      });
  }
  contact() {
    this.itemsList.children(":last").click(async () => {
      $(".side-menu").animate({ left: `${-this.listWidth}` }, 500);
      $(this.menuBtn).removeClass("fa-x").addClass("fa-align-justify");
      $(".list-unstyled li").animate({ top: "200px" }, "slow");
      $("#searchContainer").css("display", "none");
      $("#rowdata").css("display", "flex");
      $("body").css("overflow", "auto");
      $("#rowdata")
        .html(`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *exemple@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>`);
      let passwordtester = "";
      let checker1 = "";
      let checker2 = "";
      let checker3 = "";
      let checker4 = "";
      let checker5 = "";
      let checker6 = "";
      $("#nameInput").keyup(function () {
        const regexname = /^[a-zA-Z ]{2,30}$/;
        const nametest = regexname.test(this.value) ? "Match!" : "No Match";
        if (nametest != "Match!") {
          $("#nameAlert").removeClass("d-none");
          $("#nameAlert").addClass("d-block");
          checker1 = false;
        } else {
          $("#nameAlert").addClass("d-none");
          $("#nameAlert").removeClass("d-block");
          checker1 = true;
        }
      });
      $("#emailInput").keyup(function () {
        const regexemail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        const emailtest = regexemail.test(this.value) ? "Match!" : "No Match";
        if (emailtest != "Match!") {
          $("#emailAlert").removeClass("d-none");
          $("#emailAlert").addClass("d-block");
          checker2 = false;
        } else {
          $("#emailAlert").addClass("d-none");
          $("#emailAlert").removeClass("d-block");
          checker2 = true;
        }
      });
      $("#phoneInput").keyup(function () {
        const regexphone = /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/;
        const phonetest = regexphone.test(this.value) ? "Match!" : "No Match";
        if (phonetest != "Match!") {
          $("#phoneAlert").removeClass("d-none");
          $("#phoneAlert").addClass("d-block");
          checker3 = false;
        } else {
          $("#phoneAlert").addClass("d-none");
          $("#phoneAlert").removeClass("d-block");
          checker3 = true;
        }
      });
      $("#ageInput").keyup(function () {
        const regexage = /^([1-9]|1[0-9]|[2-9]\d)$/;
        const agetest = regexage.test(this.value) ? "Match!" : "No Match";
        if (agetest != "Match!") {
          $("#ageAlert").removeClass("d-none");
          $("#ageAlert").addClass("d-block");
          checker4 = false;
        } else {
          $("#ageAlert").addClass("d-none");
          $("#ageAlert").removeClass("d-block");
          checker4 = true;
        }
      });
      $("#passwordInput").keyup(function () {
        const regexpassword = /^[A-Za-z]\w{7,14}$/;
        passwordtester = this.value;
        const passwordtest = regexpassword.test(this.value)
          ? "Match!"
          : "No Match";
        if (passwordtest != "Match!") {
          $("#passwordAlert").removeClass("d-none");
          $("#passwordAlert").addClass("d-block");
          checker5 = false;
        } else {
          $("#passwordAlert").addClass("d-none");
          $("#passwordAlert").removeClass("d-block");
          checker5 = true;
        }
      });
      $("#repasswordInput").keyup(function () {
        const regexrepassword = /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/;
        const repasswordtest = this.value;
        console.log(passwordtester);
        if (repasswordtest != passwordtester) {
          $("#repasswordAlert").removeClass("d-none");
          $("#repasswordAlert").addClass("d-block");
          checker6 = false;
        } else {
          $("#repasswordAlert").addClass("d-none");
          $("#repasswordAlert").removeClass("d-block");
          checker6 = true;
        }
      });
      $("input").keyup(function () {
        if (
          checker1 == true &&
          checker2 == true &&
          checker3 == true &&
          checker4 == true &&
          checker5 == true &&
          checker6 == true
        ) {
          $("#submitBtn").attr("disabled", false);
        } else {
          $("#submitBtn").attr("disabled", true);
        }
      });
    });
  }
  showMeal(mealArr) {
    try {
      let mealContainer = ``;
      for (let index = 0; index < mealArr.meals.length; index++) {
        mealContainer += `
        <div class="col-md-3">
            <div id="${mealArr.meals[index].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${mealArr.meals[index].strMealThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${mealArr.meals[index].strMeal}</h3>
                </div>
            </div>
        </div>`;
      }
      $("#rowdata").html(mealContainer);
    } catch (error) {}
  }
  mealDetails(mealArr) {
    try {
      $("#rowdata").click(async (e) => {
        if ($(e.target).parents(".meal").attr("id") == undefined) {
          let mealName = $(e.target)
            .parents(".meal")
            .children(".meal-layer")
            .children("h3")
            .text();
          this.showMeal(await this.mealFetch(mealName));
        } else if ($(e.target).parents(".meal").attr("id") != undefined) {
          let mealId = $(e.target).parents(".meal").attr("id");
          let details = await this.idFetch(mealId);
          this.mealDetails(details.meals);
        }
      });
      let detailsContainer = ``;
      for (let index = 0; index < mealArr.length; index++) {
        detailsContainer += `
        <div class="col-md-4">
        <img class="w-100 rounded-3" src="${mealArr[index].strMealThumb}" alt="">
            <h2>${mealArr[index].strMeal}</h2>
    </div>
    <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${mealArr[index].strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${mealArr[index].strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${mealArr[index].strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                <li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient1}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient2}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient3}</li><li class="alert alert-info m-2 p-1">2${mealArr[index].strIngredient4}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient5}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient6}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient7}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient9}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient10}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient11}</li><li class="alert alert-info m-2 p-1">2 tsp Cornstarch</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient12}</li><li class="alert alert-info m-2 p-1">${mealArr[index].strIngredient13}</li>
            </ul>

            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                
    <li class="alert alert-danger m-2 p-1">${mealArr[index].strTags}</li>
            </ul>

            <a target="_blank" href="${mealArr[index].strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${mealArr[index].strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`;
      }
      $("#rowdata").html(detailsContainer);
    } catch (error) {
      this.randomMeals();
    }
  }
  loading(location) {
    $(location).ready(() => {
      $(".loading-screen").fadeOut(2500, () => {
        $("body").css("overflow", "auto");
      });
    });
  }
  async mealFetch(mealName) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealName}`
    );
    response = await response.json();
    return response;
  }
  async categoriesFetch() {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    response = await response.json();
    return response;
  }
  async idFetch(id) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    response = await response.json();
    return response;
  }
  async randomFetch() {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    response = await response.json();
    return response;
  }
  async areaFetch() {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    response = await response.json();
    return response;
  }
  async areaMealsFetch(location) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${location}`
    );
    response = await response.json();
    return response;
  }
  async angFetch() {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    response = await response.json();
    return response;
  }
  async angMealsFetch(ingredient) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    response = await response.json();
    return response;
  }
  async nameSearchFetch(name) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );
    response = await response.json();
    return response;
  }
  async letterSearchFetch(letter) {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    response = await response.json();
    return response;
  }
}
