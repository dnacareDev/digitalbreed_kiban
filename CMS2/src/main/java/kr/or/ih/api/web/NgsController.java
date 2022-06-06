package kr.or.ih.api.web;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.NgsService;

@Controller
public class NgsController
{
	@Autowired
	private NgsService service;
	
	@Autowired
	private HomeService homeService;
	
	@RequestMapping("/ngs_list")
	public ModelAndView NGSList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int count = service.SelectOutcomeCount(user.getUser_username());
			
			int limit = 10;
			int offset = (page_num - 1) * limit;
			int start_page = ((page_num - 1) / 5) * 5 + 1;
			int end_page = (count + limit - 1) / limit;
			
			Pagination page = new Pagination();
			page.setCount(count);
			page.setPage_num(page_num);
			page.setStart_page(start_page);
			page.setEnd_page(end_page);
			page.setOffset(offset);
			page.setLimit(limit);
			
			List<Outcome> outcome = service.SelectOutcomeList(user.getUser_username(), offset, limit);
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());

			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			mv.addObject("page", page);
			
			mv.setViewName("ngs/ngs_list");
		}
		
		return mv;
	}
	
	@RequestMapping("/ngs_detail")
	public ModelAndView NGSDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("outcome_id") int outcome_id)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int delete = homeService.DeleteNotice(user.getUser_username(), outcome_id);
			
			Outcome outcome = service.SelectOutcome(outcome_id);
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			
			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			
			mv.setViewName("ngs/ngs_detail");
		}
		
		return mv;
	}
	
	@RequestMapping("/ngs_add")
	public ModelAndView NGSAdd(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");

			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			List<Crop> crop = service.SelectCrop();
			
			mv.addObject("notice", notice);
			mv.addObject("crop", crop);
			
			mv.setViewName("ngs/ngs_add");
		}
		
		return mv;
	}
	
	// 작물별 버전 정보 조회
	@ResponseBody
	@RequestMapping("/ngs/selectMarkerVersion")
	public List<Marker> SelectMarkerVersion(@RequestParam("marker_crop") String marker_crop)
	{
		List<Marker> result = service.SelectMarkerVersion(marker_crop);
		
		if(result == null)
		{
			return new ArrayList<Marker>();
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("insertNGS")
	public String InsertNGS(@RequestParam("marker_id") int marker_id, @RequestParam("dad_name") String dad_name, @RequestParam("mom_name") String mom_name, @RequestParam("sample_file") MultipartFile sample_file, @RequestParam("fasta_file") MultipartFile[] fasta_file) throws InterruptedException
	{
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/web/mabanalysis/resultfiles/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
		String marker_file = service.SelectMarkerFileName(marker_id);
		
		try
		{
			sample_file.transferTo(new File(path + "/" + "sample.txt"));
			
			for(int i = 0; i < fasta_file.length; i++)
			{
				fasta_file[i].transferTo(new File(path + "/" + fasta_file[i].getOriginalFilename()));
			}
			
			CompletableFuture.runAsync(() -> {
			    RunMABC runmabc = new RunMABC();
				runmabc.MakeRunMABC(date_name, "/data/apache-tomcat-9.0.8/webapps/ROOT" + marker_file, dad_name, mom_name);
			});
			
		}
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		return "common/web/mabanalysis/resultfiles/" + date_name + "/" + date_name;
	}
}