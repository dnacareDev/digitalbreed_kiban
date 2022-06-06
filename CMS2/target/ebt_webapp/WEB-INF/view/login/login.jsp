<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>디지털육종정보화시스템</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/login/login.css">
    <script src="vendor/jquery-3.6.0.js"></script>
    <style>
    	.joinError{
    		display: none;
    		color: red;
    		font-size: 12px;
    	}
    </style>
</head>
<body>
	<div class="wrapper">
		<header id="login_header">
            <div class="logo">
                <a href="#">
                    <img class="logo_img" src="images/logo.png" alt="로고">
                </a>
            </div>
        </header>
        <div class="background-top"></div>
        <section class="login_section">
            <div class="container_table clearfix">
                <div class="container_inner">
                    <div class="container_cover clearfix">
                        <div class="btn_cover">
                        </div>
                        <div class="contents">
                            <div class="login_title">
                                <h3>Login</h3>
                            </div>
                            <div class="form_list clearfix">
                            	<form action="loginForm" method="POST">
                                <div class="box_input">
                                    <div class="id">
                                        <span class="sub_title">E-mail</span>
                                        <input type="text" name="user_username">
                                    </div>
                                    <div class="ps">
                                        <span class="sub_title">PASSWORD</span>
                                        <input type="password" name="user_password">
                                    </div>
                                </div>
                                <div class="submit_btn">
                                    <!--버튼 타입을 주석을 풀고 선택하시면 됩니다-->
                                    <input type="submit" value="로그인">
                                    <!--<input type="button" value="로그인">-->
                                    <!--<button type="button">로그인</button>-->
                                </div>
                                </form>
                                <div class="link_list clearfix">
                                    <a href="" class="member" onclick="popupShow('#member1')">회원가입</a>
                                    <a href="" class="psSch" onclick="popupShow('#member2')">비밀번호 찾기</a>
                                    <a href="" class="psSch" onclick="popupShow('#member3')" style="margin-right: 10px;">비밀번호 변경</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    
    <div class="member_pop member_pop1" id="member1">
        <div class="member_pop_table">
            <div class="member_pop_inner">
                <div class="member_pop_cover clearfix">
                    <div class="member_btn_cover">
                        <span class="member_close" onclick="popupHide('#member1')"></span>
                    </div>
                    <div class="member_content">
                        <div class="member_title">
                            <h4>회원가입</h4>
                        </div>
                        <div class="member_email">
                            <div class="email">
                                <span class="sub_title">E-mail</span>
                                <input type="email" id="new_username" name="">
                                <span class="joinError" id="mem1_username_error"></span>
                            </div>
                            <div class="email">
                                <span class="sub_title">비밀번호 입력</span>
                                <input type="password" id="new_password" name="">
                            </div>
                            <div class="email">
                                <span class="sub_title">비밀번호 재입력</span>
                                <input type="password" id="chk_password" name="">
                            </div>
	                        <div class="msg" id="mem1_error">
	                            <span class="pwd_false" id="mem1_password_error"></span>
	                        </div>
                        </div>
                        <div class="member_submit">
                            <!-- <button type="button" onclick="popupShow('#member2')">이메일 전송</button> -->
                            <button type="button" onclick="Join();">회원가입</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="member_pop member_pop2" id="member2">
        <div class="member_pop_table">
            <div class="member_pop_inner">
                <div class="member_pop_cover clearfix">
                    <div class="member_btn_cover">
                        <span class="member_close" onclick="popupHide('#member2')"></span>
                    </div>
                    <div class="member_content">
                        <div class="member_title">
                            <h4>비밀번호 찾기</h4>
                        </div>
                        <div class="member_email">
                            <div class="email">
                                <span class="sub_title">E-mail</span>
                                <input type="email" id="origin_username" name="">
                                <span class="joinError"></span>
                            </div>
                            <div class="email" id="temp_password" style="display: none;">
                                <span class="sub_title">임시 비밀번호</span>
                                <input type="text" id="change_password" name="" readonly="readonly">
                            </div>
                        </div>
                        <div class="member_submit">
                            <button type="button" id="findBtn" onclick="FindPassword()">비밀번호 찾기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!--회원가입 비밀번호 변경-->
    <div class="member_pop member_pop3" id="member3">
        <div class="member_pop_table">
            <div class="member_pop_inner">
                <div class="member_pop_cover clearfix">
                    <div class="member_btn_cover">
                        <span class="member_close" onclick="popupHide('#member3')"></span>
                    </div>
                    <div class="member_content">
                        <div class="member_title">
                            <h4>비밀번호 변경</h4>
                        </div>
                        <div class="member_email">
                            <div class="email">
                                <span class="sub_title">E-mail</span>
                                <input type="email" id="mem3_username" name="">
                                <span class="joinError" id="mem3_username_error"></span>
                            </div>
                            <div class="email">
                                <span class="sub_title">변경 비밀번호</span>
                                <input type="password" id="mem3_password" name="">
                            </div>
                            <div class="email">
                                <span class="sub_title">변경 비밀번호 재입력</span>
                                <input type="password" id="mem3_chk_password" name="">
                            </div>
                        </div>
                        <div class="msg" id="mem3_error">
                            <span class="pwd_false" id="mem3_password_error"></span>
                        </div>
                        <div class="member_submit">
                            <button type="button" onclick="UpdatePassword();">변경</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    <div class="member_pop member_pop4" id="member4">
        <div class="member_pop_table">
            <div class="member_pop_inner">
                <div class="member_pop_cover clearfix">
                    <div class="member_btn_cover">
                    </div>
                    <div class="member_content">
                        <div style="margin-bottom: 50px;"></div>
                        <div class="member_title">
                            <h4>회원가입에 성공하였습니다.</h4>
                        </div>
                        <div style="margin-bottom: 80px;"></div>
                        <div class="member_submit">
                            <button type="button" onclick="popupHide('#member4')">로그인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="member_pop member_pop5" id="member5">
        <div class="member_pop_table">
            <div class="member_pop_inner">
                <div class="member_pop_cover clearfix">
                    <div class="member_btn_cover">
                    </div>
                    <div class="member_content">
                        <div style="margin-bottom: 50px;"></div>
                        <div class="member_title">
                            <h4>비밀번호가 변경되었습니다.</h4>
                        </div>
                        <div style="margin-bottom: 80px;"></div>
                        <div class="member_submit">
                            <button type="button" onclick="popupHide('#member5')">로그인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!--팝업 배경-->
    <div class="dim"></div>
</body>
<script type="text/javascript">
	function popupShow(e)
	{
	    $(".member_pop").hide();
	    $(e).show();
	    $(".dim").show();
	}
	
	function popupHide(e)
	{
	    $(e).hide();
	    $(".dim").hide();
	}
	
	$(".link_list a").click(function(e)
	{
	   e.preventDefault(); 
	});
	
	function Join()
	{
		var user_username = $("#new_username").val();
		var user_password = $("#new_password").val();
		var chk_password = $("#chk_password").val();
		
		var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		
		if(regEmail.test(user_username))
		{
			$("#mem1_username_error").css("display", "none");
			
			if(user_password == "")
			{
				$("#mem1_password_error").text("비밀번호를 입력해주세요.");
				$("#mem1_error").css("display", "block");
			}
			else if(chk_password == "")
			{
				$("#mem1_password_error").text("비밀번호를 재입력해주세요.");
				$("#mem1_error").css("display", "block");
			}
			else
			{
				if(user_password == chk_password)
				{
					$("#mem1_error").css("display", "none");
					
					$.ajax(
					{
						url : "checkUsername",
						method : "POST",
						data : {"user_username" : user_username},
						dataType : "JSON",
						success : function(result)
						{
							if(result != 0)
							{
								$("#mem1_password_error").text("이미 등록된 이메일입니다.");
								$("#mem1_error").css("display", "block");
							}
							else
							{
								$("#mem1_error").css("display", "none");
								
								$.ajax(
								{
									url : "join",
									method : "POST",
									data : {"user_username" : user_username, "user_password" : user_password},
									dataType : "JSON",
									success : function(result)
									{
										if(result == 0)
										{
											$("#mem1_password_error").text("회원가입에 실패하였습니다.");
											$("#mem1_error").css("display", "block");
										}
										else
										{
											$("#mem1_error").css("display", "none");
											
											popupHide('#member1');
											popupShow('#member4');
										}
									}
								});
							}
						}
					});
				}
				else
				{
					$("#mem1_password_error").text("비밀번호가 일치하지 않습니다.");
					$("#mem1_error").css("display", "block");
				}
			}
		}
		else
		{
			$("#mem1_username_error").text("이메일 형식이 아닙니다.");
			$("#mem1_username_error").css("display", "block");
		}
	}
	
	function FindPassword()
	{
		var user_username = $("#origin_username").val();
		
		var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		
		if(regEmail.test(user_username))
		{
			$(".joinError").css("display", "none");
			
			$.ajax(
			{
				url : "findPassword",
				method : "POST",
				data : {"user_username" : user_username},
				dataType : "text",
				success : function(result)
				{
					console.log(result);
					if(result == "")
					{
						$(".joinError").text("가입되지 않은 이메일입니다.");
						$(".joinError").css("display", "block");
					}
					else
					{
						$(".joinError").css("display", "none");
						
						$("#temp_password").css("display", "block");
						$("#change_password").val(result);
						
						$("#findBtn").text("로그인");
						$("#findBtn").attr("onclick", "popupHide('#member2')")
					}
				}
			});
		}
		else
		{
			$(".joinError").text("이메일 형식이 아닙니다.");
			$(".joinError").css("display", "block");
		}
	}
	
	function UpdatePassword()
	{
		var user_username = $("#mem3_username").val();
		var user_password = $("#mem3_password").val();
		var chk_password = $("#mem3_chk_password").val();
		
		var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		
		if(regEmail.test(user_username))
		{
			$("#mem3_username_error").css("display", "none");
			
			if(user_password == "")
			{
				$("#mem3_password_error").text("비밀번호를 입력해주세요.");
				$("#mem3_error").css("display", "block");
			}
			else if(chk_password == "")
			{
				$("#mem3_password_error").text("비밀번호를 재입력해주세요.");
				$("#mem3_error").css("display", "block");
			}
			else
			{
				if(user_password == chk_password)
				{
					$("#mem3_error").css("display", "none");
					
					$.ajax(
					{
						url : "checkUsername",
						method : "POST",
						data : {"user_username" : user_username},
						dataType : "JSON",
						success : function(result)
						{
							if(result == 0)
							{
								$("#mem3_password_error").text("등록되지 않은 이메일입니다.");
								$("#mem3_error").css("display", "block");
							}
							else
							{
								$("#mem3_error").css("display", "none");
								
								$.ajax(
								{
									url : "updatePassword",
									method : "POST",
									data : {"user_username" : user_username, "user_password" : user_password},
									dataType : "JSON",
									success : function(result)
									{
										console.log(123)
										console.log(result)
										if(result == 0)
										{
											$("#mem3_password_error").text("비밀번호 변경에 실패하였습니다.");
											$("#mem3_error").css("display", "block");
										}
										else
										{
											$("#mem3_error").css("display", "none");
											
											popupHide('#member3');
											popupShow('#member5');
										}
									}
								});
							}
						}
					});
				}
				else
				{
					$("#mem3_password_error").text("비밀번호가 일치하지 않습니다.");
					$("#mem3_error").css("display", "block");
				}
			}
		}
		else
		{
			$("#mem3_username_error").text("이메일 형식이 아닙니다.");
			$("#mem3_username_error").css("display", "block");
		}
	}
</script>
</html>