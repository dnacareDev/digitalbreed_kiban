package kr.or.ih.api.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.LoginService;
import tm.massmail.sendapi.ThunderMassMailSender;
import tm.massmail.sendapi.ThunderMassMail;



@Controller
public class LoginController
{
	@Autowired
	private LoginService service;
	
	// 로그인 페이지
	@RequestMapping("/login")
	public ModelAndView Login(ModelAndView mv)
	{
		mv.setViewName("login/login");
		
		return mv;
	}
	
	// 로그인 페이지
	@RequestMapping("/loginForm")
	public void LoginForm(ModelAndView mv, HttpServletRequest request, HttpServletResponse response, @RequestParam("user_username") String user_username, @RequestParam("user_password") String user_password) throws IOException
	{
		HttpSession session = request.getSession();
		
		User user = service.SelectUser(user_username, user_password);
		System.out.println("user : " + user);
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		
		if(user == null)
		{
			out.println("<script>");
			out.println("location.href='/digit/login'");
			out.println("</script>");
		}
		else
		{
			if(user.getUser_status() == 0)
			{
				out.println("<script>");
				out.println("location.href='/digit/login'");
				out.println("alert('관리자의 승인을 대기중입니다.')");
				out.println("</script>");
			}
			else
			{
				session.setAttribute("user", user);
				
				out.println("<script>");
				out.println("location.href='/digit/home'");
				out.println("</script>");
			}
		}
	}
	
	@RequestMapping("/logout")
	public ModelAndView Logout(ModelAndView mv, HttpSession session)
	{
		session.invalidate();
		
		mv.setViewName("redirect:/karyotype_list");
		//mv.setViewName("redirect:/index.html");
		
		return mv;
	}
	
	@ResponseBody
	@RequestMapping("checkUsername")
	public int CheckUsername(@RequestParam("user_username") String user_username)
	{
		int result = service.CheckUsername(user_username);
		
		if(result == 0)
		{
			return 0;
		}
		else
		{
			return 1;
		}
	}
	
	@ResponseBody
	@RequestMapping("oldcheckUsername")
	public int OldCheckUsername(@RequestParam("user_username") String user_username, @RequestParam("old_password") String old_password)
	{		
		int result = service.OldCheckUsername(user_username, old_password);
		System.out.println("result : " + result);
		if(result == 0)
		{
			return 0;
		}
		else
		{
			return 1;
		}
	}
	
	
	
	
	// 회원가입
	@ResponseBody
	@RequestMapping("join")
	public int Join(@RequestParam("user_username") String user_username, @RequestParam("user_password") String user_password)
	{
		int result = service.Join(user_username, user_password);
		
		if(result == 0)
		{
			return 0;
		}
		else
		{
			return 1;
		}
	}
	
	@ResponseBody
	@RequestMapping("updatePassword")
	public int UpdatePassword(@RequestParam("user_username") String user_username, @RequestParam("user_password") String user_password)
	{
		int result = service.UpdatePassword(user_username, user_password);
		
		if(result == 0)
		{
			return 0;
		}
		else
		{
			return 1;
		}
	}
	
	public int roledice()
	{
		Random numGen = null;
		 
		try
		{
			numGen = SecureRandom.getInstance("SHA1PRNG");
		}
		catch(NoSuchAlgorithmException e) 
		{
        	System.out.println("난수 생성 Error");
		}
		
		if(numGen == null)
		{
			return 0;
		}
		
	    return (numGen.nextInt(35)) + 1;
	}
	

	// 비밀번호 찾기
	@ResponseBody
	@RequestMapping("findPassword")
	public String FindPassword(@RequestParam("user_username") String user_username)
	{
		String result = "";
		
		int chk_username = service.CheckUsername(user_username);
		
		if(chk_username != 0)
		{
			
		}
		
		return result;
	}
	
	// 로그인 페이지
	@ResponseBody
	@RequestMapping("/check_login")
	public int LoginForm2(HttpServletRequest request)
	{
		HttpSession session = request.getSession();
		User user = service.SelectUser("liberty@dnacare.co.kr", "1234");
		session.setAttribute("user", user);
		System.out.println("login user name: " + session.getAttribute("user"));
		int result = 0;
		
		if(session.getAttribute("user") == null)
		{
			result = 1;
		}
		
		return result;
	}
}