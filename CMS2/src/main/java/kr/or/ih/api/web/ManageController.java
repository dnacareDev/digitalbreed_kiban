package kr.or.ih.api.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.ManageService;

@Controller
public class ManageController
{
	@Autowired
	private ManageService service;
	
	@Autowired
	private HomeService homeService;
	
	@RequestMapping("/manage_list")
	public ModelAndView ManageList(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			if(user.getUser_type() == 0)
			{
				List<Notice> notice = homeService.SelectNotice(user.getUser_username());
				
				mv.addObject("notice", notice);
				
				mv.setViewName("manage/manage_list");
			}
			else
			{
				mv.setViewName("home/home");
			}
		}
		
		return mv;
	}
	
	@ResponseBody
	@RequestMapping("/selectManage")
	public Map<String, Object> SelectManage()
	{
		Map<String, Object> result = new HashMap<String, Object>();
		
		List<Counts> counts = service.SelectManage();
		
		result.put("counts", counts);
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("updateUserStatus")
	public int UpdateUserStatus(@RequestParam("user_username") String user_username, @RequestParam("user_status") int user_status)
	{
		int result = service.UpdateUserStatus(user_username, user_status);
		
		return result;
	}
}