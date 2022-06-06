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

import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.IndexService;

@Controller
public class IndexController
{
	@Autowired
	private IndexService service;
	
	@RequestMapping("")
	public String mainPage(ModelAndView mv)
	{
		return "redirect:/home"; 
	}
	
	@RequestMapping("/")
	public String mainPageSlash(ModelAndView mv)
	{
		return "redirect:/home";
	}
	
	@RequestMapping("/digit")
	public String mainPageSlashDigit(ModelAndView mv)
	{
		return "redirect:/home";
	}
	
	@ResponseBody
	@RequestMapping("/SelectList")
	public Map<String, Object> SelectList(HttpServletRequest request, @RequestParam("type") int type)
	{
		Map<String, Object> result = new HashMap<String, Object>();
		
		if(type == 0)
		{
			List<Marker> marker = service.SelectMarkerList();
			
			result.put("marker", marker);
		}
		else
		{
			HttpSession session = request.getSession();
			
			User user = (User)session.getAttribute("user");
			
			List<Outcome> outcome = service.SelectOutcomeList("admin", type);
			
			result.put("outcome", outcome);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("updateOutcomeFileStatus")
	public int UpdateOutcomeFileStatus(@RequestParam("outcome_id") int outcome_id)
	{
		int result = service.UpdateOutcomeFileStatus(outcome_id);
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("insertAnalysis")
	public int InsertAnalysis(HttpServletRequest request, @RequestParam("type") int type)
	{
		HttpSession session = request.getSession();
		
		User user = (User)session.getAttribute("user");
		
		int result = service.InsertAnalysis("admin", type);
		
		return result;
	}
}