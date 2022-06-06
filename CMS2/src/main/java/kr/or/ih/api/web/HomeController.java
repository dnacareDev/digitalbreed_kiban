package kr.or.ih.api.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;

@Controller 
public class HomeController  
{
	@Autowired
	private HomeService service;
	
	@RequestMapping("/home")
	public ModelAndView Home(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			List<Notice> notice = service.SelectNotice(user.getUser_username());
			
			Counts first = service.SelectFirstCount(user.getUser_username());
			Counts second = service.SelectSecondCount(user.getUser_username());
			Counts third = service.SelectThirdCount(user.getUser_username());
			Counts total = service.SelectTotalCount(user.getUser_username());
			
			Counts file = service.SelectFileCount(user.getUser_username());
			
			mv.addObject("user", session.getAttribute("user"));
			mv.addObject("notice", notice);
			mv.addObject("first", first);
			mv.addObject("second", second);
			mv.addObject("third", third);
			mv.addObject("total", total);
			mv.addObject("file", file);
			
			mv.setViewName("home/home");
		}
		
		return mv;
	}
}